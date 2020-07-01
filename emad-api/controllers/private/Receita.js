const { v4: uuidv4 } = require('uuid');

module.exports = function (app) {

    const _table = "tb_receita";

    app.post('/receita', async function (req, res) {
        let receita = req.body;
        delete receita.id;

        let usuario = req.usuario;
        const util = new app.util.Util();
        let errors = [];

        req.assert("idEstabelecimento").notEmpty().withMessage("O campo Estabelecimento é um campo obrigatório");
        req.assert("idMunicipio").notEmpty().withMessage("O campo Município é um campo obrigatório");
        req.assert("idProfissional").notEmpty().withMessage("O campo Profissional é um campo obrigatório");
        req.assert("idPaciente").notEmpty().withMessage("O campo Paciente é um campo obrigatório");
        req.assert("idSubgrupoOrigem").notEmpty().withMessage("O campo Origem é um campo obrigatório");
        req.assert("ano").notEmpty().withMessage("O campo Ano é um campo obrigatório");
        req.assert("ano").matches(/^[0-9]+$/).withMessage("O campo Ano deve conter somente números");
        req.assert("dataEmissao").notEmpty().withMessage("O campo Data emissão é um campo obrigatório");

        errors = req.validationErrors();

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        if (receita.idSubgrupoOrigem == "null") {
            errors = util.customError(errors, "header", "Origem é um campo obrigatório", "");
            res.status(400).send(errors);
            return;
        }

        const connection = app.dao.connections.EatendConnection();

        const receitaRepository = new app.dao.ReceitaDAO(connection);

        try {
            await connection.beginTransaction();

            receita.dataCriacao = new Date;
            receita.idUsuarioCriacao = usuario.id;

            receita.numero = await receitaRepository.obterProximoNumero(receita.ano, receita.idEstabelecimento);
            
            var response = await receitaRepository.salva(receita);

            receita.id = response[0].insertId;

            res.status(201).send(receita);

            await connection.commit();
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));
            await connection.rollback();
        }
        finally {
            connection.close();
        }
    });

    app.put('/receita', async function (req, res) {
        let receita = req.body;
        let usuario = req.usuario;
        let util = new app.util.Util();
        let errors = [];
        let situacao = 3;//FINALIZADA
        let gravaMovimento = false;
        let movimentoGeral = {};
        let itemMovimentoGeral = {};
        const guid =  uuidv4();

        req.assert("idEstabelecimento").notEmpty().withMessage("O campo Estabelecimento é um campo obrigatório");
        req.assert("idMunicipio").notEmpty().withMessage("O campo Município é um campo obrigatório");
        req.assert("idProfissional").notEmpty().withMessage("O campo Profissional é um campo obrigatório");
        req.assert("idPaciente").notEmpty().withMessage("O campo Paciente é um campo obrigatório");
        req.assert("idSubgrupoOrigem").notEmpty().withMessage("O campo Origem é um campo obrigatório");
        req.assert("ano").notEmpty().withMessage("O campo Ano é um campo obrigatório");
        req.assert("dataEmissao").notEmpty().withMessage("O campo Data emissão é um campo obrigatório");

        errors = req.validationErrors();

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        if (receita.idSubgrupoOrigem == "null") {
            errors = util.customError(errors, "header", "Origem é um campo obrigatório", "");
            res.status(401).send(errors);
        }

        
        const connection = app.dao.connections.EatendConnection();

        const receitaRepository = new app.dao.ReceitaDAO(connection);
        const itemReceitaRepository = new app.dao.ItemReceitaDAO(connection);
        const estoqueRepository = new app.dao.EstoqueDAO(connection);
        const movimentoGeralRepository = new app.dao.MovimentoGeralDAO(connection);
        const itemMovimentoGeralRepository = new app.dao.ItemMovimentoGeralDAO(connection);
        const movimentoLivroRepository = new app.dao.MovimentoLivroDAO(connection);
        const pacienteLivroRepository = new app.dao.PacienteDAO(connection);

        try {
            await connection.beginTransaction();
            
            //Verifica se existe número de controle duplicado

            //Gravar itens da receita
            for (const itemReceita of receita.itensReceita) {                
                itemReceita.idReceita = receita.id;
                itemReceita.dataCriacao = new Date;
                itemReceita.dataUltDisp = itemReceita.qtdDispMes > 0 ? itemReceita.dataCriacao : null;
                itemReceita.qtdDispAnterior = itemReceita.qtdDispMes;
                itemReceita.idUsuarioCriacao = usuario.id;
                itemReceita.situacao = 2;//FINALIZADO
                itemReceita.dataFimReceita = new Date;
                itemReceita.idUsuarioFimReceita = usuario.id;

                //Se algum item não foi dispensado completamente, ele ficará como ABERTO e a RECEITA também
                if(itemReceita.qtdPrescrita > itemReceita.qtdDispMes){
                    situacao = 2; // ABERTA
                    itemReceita.situacao = 1; //ABERTO
                    itemReceita.dataFimReceita = null;
                    itemReceita.idUsuarioFimReceita = null;
                }

                //Se o item possuir algum item de estoque, será necessário gravar o movimento
                if(itemReceita.itensEstoque && itemReceita.itensEstoque.length > 0)
                    gravaMovimento = true;

                var responseItemReceita = await itemReceitaRepository.salva(itemReceita);    
                itemReceita.id = responseItemReceita[0].insertId; 
            }           
            
            receita.dataAlteracao = new Date;
            receita.idUsuarioAlteracao = usuario.id;
            receita.situacao = situacao;   
            receita.dataUltimaDispensacao = gravaMovimento ? receita.dataAlteracao : null;
            
            //atualiza o status da receita
            var responseReceita = await receitaRepository.atualizaStatus(receita);
            
            if(gravaMovimento)
            {
                movimentoGeral.idTipoMovimento = 3;
                movimentoGeral.idUsuario = usuario.id;
                movimentoGeral.idEstabelecimento = receita.idEstabelecimento;
                movimentoGeral.idReceita = receita.id;
                movimentoGeral.idPaciente = receita.idPaciente;
                movimentoGeral.numeroDocumento = receita.ano + "-" + receita.idEstabelecimento + "-" + receita.numero;
                movimentoGeral.dataMovimento = new Date;
                movimentoGeral.numeroControle = guid;
                movimentoGeral.idUsuarioCriacao = usuario.id;
                movimentoGeral.dataCriacao = new Date;
                movimentoGeral.situacao = 1;

                var responseMovimentoGeral = await movimentoGeralRepository.salva(movimentoGeral);
                movimentoGeral.id = responseMovimentoGeral[0].insertId;

                for (const itemReceita of receita.itensReceita) {                
                    for (const itemEstoque of itemReceita.itensEstoque) {                    
                        var saldoAnteriorUnidade = 0;
                        var saldoAtualUnidade = 0;
                        //var estoque = {};
                        var qtdEstoque = 0;
                        var nomeMaterial = "";
                        var idEstoqueAux = 0;

                        itemMovimentoGeral = {};
                        itemMovimentoGeral.idMovimentoGeral = movimentoGeral.id;
                        itemMovimentoGeral.idMaterial = itemEstoque.idMaterial;
                        itemMovimentoGeral.idFabricante = itemEstoque.idFabricanteMaterial;
                        itemMovimentoGeral.lote = itemEstoque.lote;
                        itemMovimentoGeral.validade = itemEstoque.validade;
                        itemMovimentoGeral.quantidade = itemEstoque.qtdDispensar;
                        itemMovimentoGeral.idItemReceita = itemReceita.id;
                        itemMovimentoGeral.idEstabelecimento = receita.idEstabelecimento;

                        itemMovimentoGeral.idUsuarioCriacao = usuario.id;
                        itemMovimentoGeral.dataCriacao = new Date();
                        itemMovimentoGeral.situacao = 1;

                        var responseItemMovimentoGeral = await itemMovimentoGeralRepository.salva(itemMovimentoGeral);
                        itemMovimentoGeral.id = responseItemMovimentoGeral[0].insertId;

                        saldoAnteriorUnidade = await estoqueRepository.carregaQuantidadePorMaterialEstabelecimento(itemEstoque);

                        var estoque = await estoqueRepository.carregaEstoquePorMaterial(itemEstoque);

                        if(estoque.length > 0){                            
                            qtdEstoque = estoque[0].quantidade;
                            nomeMaterial = estoque[0].nomeMaterial;
                            idEstoqueAux = estoque[0].id;   
                             
                            if(qtdEstoque > 0){
                               var qtd = qtdEstoque - itemEstoque.qtdDispensar;
                                 
                               if(qtd > 0)
                                   var responseAtualizacaoQtd = await estoqueRepository.atualizaQuantidadeEstoque(qtd, usuario.id, idEstoqueAux);
                               else{
                                    //lista de estoque insuficiente
                               }
                            }
                            else{
                                //lista de estoque insuficiente
                            }
                        }

                        saldoAtualUnidade = await estoqueRepository.carregaQuantidadePorMaterialEstabelecimento(itemEstoque);

                        var responseMovimentoLivro = await movimentoLivroRepository.carregaQtdSaida(itemMovimentoGeral);
                        
                        if(responseMovimentoLivro.length > 0){

                            var qtdeSaidaLivro = responseMovimentoLivro[0].quantidadeSaida + itemEstoque.qtdDispensar;
                            var responseAtualizacaoMovimentoLivro = await movimentoLivroRepository.atualizaSaida(qtdeSaidaLivro, saldoAtualUnidade, itemMovimentoGeral, usuario.id);
                        }
                        else{

                            var nomePaciente = await pacienteLivroRepository.carregaNomePaciente(receita.idPaciente);
                            var historico = nomePaciente + " Nº da receita: " 
                                + receita.ano + "-" 
                                + receita.idEstabelecimento + "-" 
                                + receita.numero 
                                + ((itemReceita.numReceitaControlada) ? " NR: " + itemReceita.numReceitaControlada : "");

                            let movimentoLivro = {};
                            movimentoLivro.idMovimentoGeral = movimentoGeral.id;
                            movimentoLivro.idEstabelecimento = receita.idEstabelecimento;
                            movimentoLivro.idMaterial = itemEstoque.idMaterial;
                            movimentoLivro.idTipoMovimento = 3;
                            movimentoLivro.saldoAnterior = saldoAnteriorUnidade;
                            movimentoLivro.quantidadeSaida = itemEstoque.qtdDispensar;
                            movimentoLivro.saldoAtual = saldoAtualUnidade;
                            movimentoLivro.dataMovimentacao = new Date();
                            movimentoLivro.historico = historico;

                            movimentoLivro.idUsuarioCriacao = usuario.id;
                            movimentoLivro.dataCriacao = new Date;
                            movimentoLivro.situacao = 1;
                            
                            var responseMovimentoLivro = await movimentoLivroRepository.salva(movimentoLivro);
                            movimentoLivro.id = responseMovimentoLivro[0].insertId;

                        }
                    }
                }
            }

            res.status(201).send(responseReceita);

            await connection.commit();
        }
        catch (exception) {
            console.log("Erro ao salvar a receita (" + receita.numero + "), exception: " +  exception);
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));
            await connection.rollback();
        }
        finally {
            connection.close();
        }
    });

    app.get('/receita', function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let errors = [];
        let addFilter = req.query;

        lista(addFilter, res).then(function (resposne) {
            res.status(200).json(resposne);
            return;
        });
    });


    app.get('/receita/:id', async function (req, res) {
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];


        const connection = app.dao.connections.EatendConnection();

        const receitaRepository = new app.dao.ReceitaDAO(connection);
        const itemReceitaRepository = new app.dao.ItemReceitaDAO(connection);

        try {
            
            var responseReceita = await receitaRepository.buscaPorId(id);
            var receita = responseReceita[0];

            var itensReceita = await itemReceitaRepository.buscarPorReceita(id);            
            receita.itensReceita = itensReceita ? itensReceita : null;
            
            res.status(200).json(receita);
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));            
        }
        finally {
            connection.close();
        }
    });

    function lista(addFilter, res) {
        let q = require('q');
        let d = q.defer();
        let util = new app.util.Util();
        let connection = app.dao.ConnectionFactory();
        let objDAO = new app.dao.ReceitaDAO(connection);

        let errors = [];

        objDAO.lista(addFilter, function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "obj");
                res.status(500).send(errors);
                return;
            } else {
                d.resolve(result);
            }
        });
        return d.promise;
    }
}