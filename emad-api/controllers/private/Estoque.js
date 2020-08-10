const { v4: uuidv4 } = require('uuid');

module.exports = function (app) {

    const _table = "tb_estoque";

    app.post('/estoque', function(req,res){
        let obj = req.body;
        let usuario = req.usuario; 
        let util = new app.util.Util();
        let errors = [];

        req.assert("idFabricanteMaterial").notEmpty().withMessage("O campo Fabricante é um campo obrigatório");
        req.assert("idMaterial").notEmpty().withMessage("O campo Material é um campo obrigatório");
        req.assert("idEstabelecimento").notEmpty().withMessage("O campo Estabelecimento é um campo obrigatório");
        req.assert("lote").notEmpty().withMessage("O campo Lote é um campo obrigatório");
        req.assert("lote").isLength({ min: 0, max: 30 }).withMessage("O campo Lote deve ter no máximo 30 caractere(s)");
        req.assert("validade").notEmpty().withMessage("O campo Validade é um campo obrigatório");
        req.assert("quantidade").notEmpty().withMessage("O campo Quantidade é um campo obrigatório");
        req.assert("quantidade").matches(/^[0-9]+$/).withMessage("O campo Quantidade deve conter somente números");
        req.assert("motivoBloqueio").isLength({ min: 0, max: 120 }).withMessage("O campo Motivo bloqueio deve ter no máximo 120 caractere(s)");        

        errors = req.validationErrors();
        
        if(errors){
            res.status(400).send(errors);
            return; 
        }

        obj.dataCriacao = new Date;
        obj.idUsuarioCriacao = usuario.id;
        obj.validade = util.dateToISO(obj.validade);
        
        salvar(obj, res).then(function(response) {
            obj.id = response.insertId;
            res.status(201).send(obj);
        }); 
    });

    app.put('/estoque', function(req,res){
        let obj = req.body;
        let usuario = req.usuario; 
        let util = new app.util.Util();
        let errors = [];

        req.assert("idFabricanteMaterial").notEmpty().withMessage("O campo Fabricante é um campo obrigatório");
        req.assert("idMaterial").notEmpty().withMessage("O campo Material é um campo obrigatório");
        req.assert("idEstabelecimento").notEmpty().withMessage("O campo Estabelecimento é um campo obrigatório");
        req.assert("lote").notEmpty().withMessage("O campo Lote é um campo obrigatório");
        req.assert("lote").isLength({ min: 0, max: 30 }).withMessage("O campo Lote deve ter no máximo 30 caractere(s)");
        req.assert("validade").notEmpty().withMessage("O campo Validade é um campo obrigatório");
        req.assert("quantidade").notEmpty().withMessage("O campo Quantidade é um campo obrigatório");
        req.assert("motivoBloqueio").isLength({ min: 0, max: 120 }).withMessage("O campo Motivo bloqueio deve ter no máximo 120 caractere(s)");
        
        errors = req.validationErrors();
        
        if(errors){
            res.status(400).send(errors);
            return; 
        }

        obj.dataAlteracao = new Date;
        obj.idUsuarioAlteracao = usuario.id;
        obj.validade = util.dateToISO(obj.validade);

        atualizar(obj, res).then(function(response) {
            obj.id = response.insertId;
            res.status(201).send(obj);
        }); 
    });
   
    app.post('/entrada-material-estoque', async function (req, res) {
        let movimentoGeral = req.body;
        delete movimentoGeral.id;
        const guid =  uuidv4();

        let usuario = req.usuario;
        const util = new app.util.Util();
        let errors = [];

        req.assert("idEstabelecimento").notEmpty().withMessage("O campo Estabelecimento é um campo obrigatório");
        
        if(movimentoGeral.idTipoMovimento == 2)
            req.assert("numeroDocumento").notEmpty().withMessage("O campo Número do documento é um campo obrigatório");
        
        errors = req.validationErrors();

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        const connection = await app.dao.connections.EatendConnection.connection();

        const estoqueRepository = new app.dao.EstoqueDAO(connection);
        const movimentoGeralRepository = new app.dao.MovimentoGeralDAO(connection);
        const itemMovimentoGeralRepository = new app.dao.ItemMovimentoGeralDAO(connection);
        const tipoMovimentoRepository = new app.dao.TipoMovimentoDAO(connection);
        const movimentoLivroRepository = new app.dao.MovimentoLivroDAO(connection);
        const pedidoCompraRepository = new app.dao.PedidoCompraDAO(connection);
        const itemPedidoCompraRepository = new app.dao.ItemPedidoCompraDAO(connection);

        try {
            await connection.beginTransaction();

            var nomeTipoMovimento = "";
            var operacaoTipoMovimento = "";

            if(movimentoGeral.idMovimentoEstornado){
                var responseMovimentoAtual = await movimentoGeralRepository.carregaOperacaoPorMovimentoId(movimentoGeral.idMovimentoEstornado);

                if(responseMovimentoAtual.operacao != 1)//Entrada
                    movimentoGeral.idTipoMovimento = 11;
                else
                    movimentoGeral.idTipoMovimento = 12;                
            }

            var responseTipoMovimento = await tipoMovimentoRepository.carregaPorId(movimentoGeral.idTipoMovimento);
            if(responseTipoMovimento){
                nomeTipoMovimento = responseTipoMovimento.nome;
                operacaoTipoMovimento = responseTipoMovimento.operacao;
            }

            movimentoGeral.idUsuario = usuario.id;
            movimentoGeral.idReceita = null;
            movimentoGeral.idPaciente = null;            
            movimentoGeral.numeroControle = guid;                                    
            movimentoGeral.dataMovimento = new Date;
            movimentoGeral.dataCriacao = new Date;
            movimentoGeral.idUsuarioCriacao = usuario.id;
            movimentoGeral.situacao = 1;

            var response = await movimentoGeralRepository.salva(movimentoGeral);

            movimentoGeral.id = response[0].insertId;

                for (const itemMovimento of movimentoGeral.itensMovimento) {                

                    if(movimentoGeral.numeroEmpenho){
                        var materialPedidoCompra = await itemPedidoCompraRepository.carregaItemPorEmpenhoMaterial(movimentoGeral.numeroEmpenho, itemMovimento.idMaterial);
                        var itemEncontrado = materialPedidoCompra.length ? materialPedidoCompra[0] : null;
                        if(itemEncontrado && itemEncontrado.id){                      
                            delete itemEncontrado.dataCriacao;
                            delete itemEncontrado.idUsuarioCriacao;
                            itemEncontrado.dataAlteracao = new Date;
                            itemEncontrado.idUsuarioAlteracao = usuario.id;
                            itemEncontrado.saldoEntregue = itemEncontrado.saldoEntregue ? itemEncontrado.saldoEntregue + itemMovimento.quantidade : itemMovimento.quantidade;
                            itemEncontrado.dataUltimaEntrega = new Date;
                            var item = await itemPedidoCompraRepository.atualiza(itemEncontrado);  
                        }
                    }

                    var saldoAnteriorUnidade = 0;
                    var saldoAnteriorUnidadeLote = 0;
                    var saldoAtualUnidade = 0;
                    var saldoEntregue = 0;
                    //var estoque = {};
                    var qtdEstoque = 0;
                    var nomeMaterial = "";
                    var idEstoqueAux = 0;

                    itemMovimentoGeral = {};
                    itemMovimentoGeral.idMovimentoGeral = movimentoGeral.id;
                    itemMovimentoGeral.idMaterial = itemMovimento.idMaterial;
                    itemMovimentoGeral.idFabricante = itemMovimento.idFabricante;
                    itemMovimentoGeral.idFabricanteMaterial = itemMovimento.idFabricante;
                    itemMovimentoGeral.lote = itemMovimento.lote;
                    itemMovimentoGeral.validade = itemMovimento.validade;
                    itemMovimentoGeral.quantidade = itemMovimento.quantidade;
                    itemMovimentoGeral.idItemReceita = null;
                    itemMovimentoGeral.idEstabelecimento = movimentoGeral.idEstabelecimento;

                    itemMovimentoGeral.idUsuarioCriacao = usuario.id;
                    itemMovimentoGeral.dataCriacao = new Date();
                    itemMovimentoGeral.situacao = 1;

                    var responseItemMovimentoGeral = await itemMovimentoGeralRepository.salva(itemMovimentoGeral);
                    itemMovimentoGeral.id = responseItemMovimentoGeral[0].insertId;

                    //obtem a quantidade de material de uma unidade no estoque
                    saldoAnteriorUnidadeLote = await estoqueRepository.carregaQuantidadePorMaterialEstabelecimentoLote(itemMovimentoGeral);

                    //obtem o saldo anterior de um material no estoque
                    saldoAnteriorUnidade = await estoqueRepository.carregaQuantidadePorMaterialEstabelecimento(itemMovimentoGeral);

                    //verifica se eh uma insercao ou uma atualizacao no estoque
                    var estoque = await estoqueRepository.carregaEstoquePorMaterial(itemMovimentoGeral);

                    let materialComBloqueio = 0;

                    var temEstoqueInsuficiente = [];

                    if(estoque.length > 0){                            
                        qtdEstoque = estoque[0].quantidade;
                        nomeMaterial = estoque[0].nomeMaterial;
                        idEstoqueAux = estoque[0].id;   
                        
                        var qtd = 0;

                        if(operacaoTipoMovimento == '1')
                            qtd = (qtdEstoque > 0 ? qtdEstoque : 0) + itemMovimento.quantidade;                                                       
                        else
                            qtd = (qtdEstoque > 0 ? qtdEstoque : 0) - itemMovimento.quantidade;  
                                                
                        if(qtd >= 0)
                            var responseAtualizacaoQtd = await estoqueRepository.atualizaQuantidadeEstoque(qtd, usuario.id, idEstoqueAux);  
                        else{
                            temEstoqueInsuficiente.push(itemMovimento);
                        }
                    }
                    else{
                        //verificando se existe material/lote/fabricante bloqueado para alguma unidade
                        var estoqueComBloqueio = await estoqueRepository.carregaEstoquePorMaterialBloqueado(itemMovimentoGeral);
                        materialComBloqueio = (estoqueComBloqueio.length > 0) ? 1 : 0;

                        novoEstoque = {};
                        novoEstoque.idFabricanteMaterial = itemMovimento.idFabricante;
                        novoEstoque.idMaterial = itemMovimento.idMaterial;
                        novoEstoque.idEstabelecimento = movimentoGeral.idEstabelecimento;
                        novoEstoque.lote = itemMovimento.lote;
                        novoEstoque.validade = new Date(itemMovimento.validade);
                        novoEstoque.quantidade = itemMovimento.quantidade;
                        novoEstoque.bloqueado = materialComBloqueio;                   
        
                        novoEstoque.idUsuarioCriacao = usuario.id;
                        novoEstoque.dataCriacao = new Date();
                        novoEstoque.situacao = 1;

                        var responseEstoque = await estoqueRepository.salvaSync(novoEstoque);
                    }

                    if(temEstoqueInsuficiente.length > 0){
                        for (const itemSemEstoque of temEstoqueInsuficiente) {   
                            errors.push(util.customError(errors, "header", "Medicamento com estoque insuficiente " + itemSemEstoque.nomeMaterial + ".", ""));
                        }                        
                        res.status(400).send(errors);
                        await connection.rollback();
                        return;
                    }

                    saldoEntregue = itemMovimento.quantidade;               
                    
                    saldoAtualUnidade = await estoqueRepository.carregaQuantidadePorMaterialEstabelecimento(itemMovimentoGeral);

                    var responseMovimentoLivro = await movimentoLivroRepository.carregaLivroPorMovimento(itemMovimentoGeral);
                    
                    if(responseMovimentoLivro.length > 0){
                        if(operacaoTipoMovimento == '1'){
                            var qtdeEntradaLivro = responseMovimentoLivro[0].quantidadeEntrada + itemMovimentoGeral.quantidade;
                            var responseAtualizacaoMovimentoLivro = await movimentoLivroRepository.atualizaEntrada(qtdeEntradaLivro, saldoAtualUnidade, itemMovimentoGeral, usuario.id);
                        }else{
                            var qtdeSaidaLivro = responseMovimentoLivro[0].quantidadeSaida + itemMovimentoGeral.quantidade;
                            var responseAtualizacaoMovimentoLivro = await movimentoLivroRepository.atualizaSaida(qtdeSaidaLivro, saldoAtualUnidade, itemMovimentoGeral, usuario.id);
                        }
                    }
                    else{

                        
                        var historico = nomeTipoMovimento + " Nº do documento: " + (movimentoGeral.idTipoMovimento == 2 ? movimentoGeral.numeroDocumento : movimentoGeral.id);

                        let movimentoLivro = {};
                        movimentoLivro.idMovimentoGeral = movimentoGeral.id;
                        movimentoLivro.idEstabelecimento = movimentoGeral.idEstabelecimento;
                        movimentoLivro.idMaterial = itemMovimentoGeral.idMaterial;
                        movimentoLivro.idTipoMovimento = movimentoGeral.idTipoMovimento;
                        movimentoLivro.saldoAnterior = saldoAnteriorUnidade;

                        if(operacaoTipoMovimento == '1')
                            movimentoLivro.quantidadeEntrada = itemMovimentoGeral.quantidade;
                        else if(operacaoTipoMovimento == '2')
                            movimentoLivro.quantidadeSaida = itemMovimentoGeral.quantidade;
                        else if(operacaoTipoMovimento == '3')
                            movimentoLivro.quantidadePerda = itemMovimentoGeral.quantidade;

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

            res.status(201).send(movimentoGeral);

            await connection.commit();
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado" + exception, ""));
            await connection.rollback();
        }
        finally {
            await connection.close();
        }
    });

    app.put('/estoque/bloquear-lote', async function (req, res) {
        let estoque = req.body;
        const util = new app.util.Util();
        delete estoque.nomeMaterial;
        delete estoque.lote;
        delete estoque.quantidade; 
        delete estoque.validade;

        let errors = [];
        let usuario = req.usuario;

        req.assert("id").notEmpty().withMessage("Lote inválido");
        req.assert("idEstabelecimento").notEmpty().withMessage("O campo Estabelecimento é um campo obrigatório");        
        
        errors = req.validationErrors();

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        const connection = await app.dao.connections.EatendConnection.connection();

        const estoqueRepository = new app.dao.EstoqueDAO(connection);
        
        try {
            await connection.beginTransaction();            
            
            if(estoque.bloqueado){
                estoque.dataBloqueio = new Date;
                estoque.idUsuarioBloqueio = usuario.id;
            }
            else{
                estoque.dataBloqueio = null;           
                estoque.idUsuarioBloqueio = null;     
            }

            estoque.dataAlteracao = new Date;
            estoque.idUsuarioAlteracao = usuario.id;            
            estoque.situacao = 1;

            var response = await estoqueRepository.atualizaSync(estoque, estoque.id);
            res.status(201).send(estoque);

            await connection.commit();
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado" + exception, ""));
            await connection.rollback();
        }
        finally {
            await connection.close();
        }
    }); 

    app.put('/estoque/alterar-validade-lote', async function (req, res) {
        let estoque = req.body;
        const util = new app.util.Util();
        delete estoque.nomeMaterial;
        delete estoque.lote;
        delete estoque.quantidade;         

        let errors = [];
        let usuario = req.usuario;

        req.assert("id").notEmpty().withMessage("Lote inválido");
        req.assert("validade").notEmpty().withMessage("O campo Validade é um campo obrigatório");        
        
        errors = req.validationErrors();

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        const connection = await app.dao.connections.EatendConnection.connection();

        const estoqueRepository = new app.dao.EstoqueDAO(connection);
        
        try {
            await connection.beginTransaction();           
            
            estoque.validade = new Date(estoque.validade);
            estoque.dataAlteracao = new Date;
            estoque.idUsuarioAlteracao = usuario.id;            
            estoque.situacao = 1;

            var response = await estoqueRepository.atualizaSync(estoque, estoque.id);
            res.status(201).send(estoque);

            await connection.commit();
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado" + exception, ""));
            await connection.rollback();
        }
        finally {
            await connection.close();
        }
    }); 

    app.get('/estoque', function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let errors = [];
        let addFilter = req.query;

        lista(addFilter, res).then(function (resposne) {
            res.status(200).json(resposne);
            return;
        });
    });


    app.get('/estoque/:id', function(req,res){        
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];


        buscarPorId(id, res).then(function(response) {
            res.status(200).json(response);
            return;      
        });
    }); 
    
    app.get('/estoque/unidade/:idEstabelecimento/pesquisa', async function (req, res) {
        let usuario = req.usuario;
        let idEstabelecimento = req.params.idEstabelecimento;
        let util = new app.util.Util();
        let errors = [];
        let addFilter = req.query;

        const connection = await app.dao.connections.EatendConnection.connection();

        const estoqueRespository = new app.dao.EstoqueDAO(connection);

        try {            
            var responseEstoque = await estoqueRespository.carregaEstoquePorUnidade(idEstabelecimento, addFilter);
            res.status(200).json(responseEstoque);
        }
        catch (exception) {
            console.log("Erro ao carregar o registro, exception: " +  exception);
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));            
        }
        finally {
            await connection.close();
        }
    });    

    app.get('/estoque/unidade/:idEstabelecimento/relatorio', async function (req, res) {
        let usuario = req.usuario;
        let idEstabelecimento = req.params.idEstabelecimento;
        let util = new app.util.Util();
        let errors = [];
        let addFilter = req.query;

        const connection = await app.dao.connections.EatendConnection.connection();

        const estoqueRespository = new app.dao.EstoqueDAO(connection);

        try {            
            var responseEstoque = await estoqueRespository.carregaEstoquePorUnidade(idEstabelecimento, addFilter);            
            for (const itemEstoque of responseEstoque) {               
                var itensEstoque = await estoqueRespository.carregaEstoquePorUnidadeDetalhe(itemEstoque.idMaterial, idEstabelecimento);
                itemEstoque.itensEstoque = itensEstoque ? itensEstoque : null;
            }
            res.status(200).json(responseEstoque);
        }
        catch (exception) {
            console.log("Erro ao carregar o registro, exception: " +  exception);
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));            
        }
        finally {
            await connection.close();
        }
    });  

    app.get('/estoque/unidade/:idEstabelecimento/material/:idMaterial', async function (req, res) {        
        let idEstabelecimento = req.params.idEstabelecimento;
        let idMaterial = req.params.idMaterial;
        let util = new app.util.Util();

        let errors = [];
        const connection = await app.dao.connections.EatendConnection.connection();

        const estoqueRespository = new app.dao.EstoqueDAO(connection);

        try {            
            var responseEstoque = await estoqueRespository.carregaEstoquePorUnidadeDetalhe(idMaterial,idEstabelecimento);
            res.status(200).json(responseEstoque);
        }
        catch (exception) {
            console.log("Erro ao carregar o registro, exception: " +  exception);
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));            
        }
        finally {
            await connection.close();
        }
    }); 

    app.get('/estoque/material/:idMaterial/tipo-pesquisa/:tipoPesquisa', async function (req, res) {
        let usuario = req.usuario;
        let idMaterial = req.params.idMaterial;
        let tipoPesquisa = req.params.tipoPesquisa;
        let util = new app.util.Util();
        let errors = [];
        let addFilter = req.query;

        const connection = await app.dao.connections.EatendConnection.connection();

        const estoqueRespository = new app.dao.EstoqueDAO(connection);

        try {            
            var responseEstoque = await estoqueRespository.carregaEstoquePorMedicamento(idMaterial);
            
            if(tipoPesquisa == "relatorio")
            {
                for (const itemEstoque of responseEstoque) {               
                    var itensEstoque = await estoqueRespository.carregaEstoquePorUnidadeDetalhe(itemEstoque.idMaterial, itemEstoque.idEstabelecimento);
                    itemEstoque.itensEstoque = itensEstoque ? itensEstoque : null;
                }
            }
            res.status(200).json(responseEstoque);
        }
        catch (exception) {
            console.log("Erro ao carregar o registro, exception: " +  exception);
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));            
        }
        finally {
            await connection.close();
        }
    });  

    app.get('/estoque/material/:idMaterial/estabelecimento/:idEstabelecimento/consumo', async function (req, res) {
        let usuario = req.usuario;
        let idMaterial = req.params.idMaterial;
        let idEstabelecimento = req.params.idEstabelecimento;        
        let util = new app.util.Util();
        let errors = [];
        let addFilter = req.query;

        const connection = await app.dao.connections.EatendConnection.connection();

        const estoqueRespository = new app.dao.EstoqueDAO(connection);

        try {            
            var responseEstoque = await estoqueRespository.carregaEstoquePorConsumo(idMaterial, idEstabelecimento, addFilter);            
            res.status(200).json(responseEstoque);
        }
        catch (exception) {
            console.log("Erro ao carregar o registro, exception: " +  exception);
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));            
        }
        finally {
            await connection.close();
        }
    });  

    app.get('/estoque/movimento-geral/:idMovimentoGeral/relatorio', async function (req, res) {        
        let util = new app.util.Util();
        let idMovimentoGeral = req.params.idMovimentoGeral;
        let errors = [];        

        const connection = await app.dao.connections.EatendConnection.connection();

        const movimentoRepository = new app.dao.MovimentoGeralDAO(connection);

        try {            
            var responseEstoque = await movimentoRepository.carregaRelatorioEntradaMaterial(idMovimentoGeral);
            res.status(200).json(responseEstoque);
        }
        catch (exception) {
            console.log("Erro ao carregar o registro, exception: " +  exception);
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));            
        }
        finally {
            await connection.close();
        }
    });  

    app.get('/estoque/material-lote/:idMaterial/estabelecimento/:idEstabelecimento', async function (req, res) {        
        let util = new app.util.Util();
        let idMaterial = req.params.idMaterial;
        let idEstabelecimento = req.params.idEstabelecimento;                
        let errors = [];        
        let addFilter = req.query;

        const connection = await app.dao.connections.EatendConnection.connection();

        const estoqueRepository = new app.dao.EstoqueDAO(connection);

        try {            
            var responseEstoque = await estoqueRepository.carregaEstoqueLotePorMaterial(idMaterial, idEstabelecimento, addFilter);
            res.status(200).json(responseEstoque);
        }
        catch (exception) {
            console.log("Erro ao carregar o registro, exception: " +  exception);
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));            
        }
        finally {
            await connection.close();
        }
    });     


    app.get('/estoque/item-movimento/:idMovimento', async function (req, res) {        
        let util = new app.util.Util();
        let idMovimento = req.params.idMovimento;
        let errors = [];        
        let addFilter = req.query;

        const connection = await app.dao.connections.EatendConnection.connection();

        const itemMovimentoGeralRepository = new app.dao.ItemMovimentoGeralDAO(connection);

        try {            
            var responseEstoque = await itemMovimentoGeralRepository.buscarPorMovimento(idMovimento);
            res.status(200).json(responseEstoque);
        }
        catch (exception) {
            console.log("Erro ao carregar o registro, exception: " +  exception);
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));            
        }
        finally {
            await connection.close();
        }
    });       
    
    app.get('/estoque-bloqueados', async function (req, res) {
        let util = new app.util.Util();
        let idMovimento = req.params.idMovimento;
        let errors = [];        
        let addFilter = req.query;

        const connection = await app.dao.connections.EatendConnection.connection();

        const estoqueRepository = new app.dao.EstoqueDAO(connection);

        try {            
            var responseEstoque = await estoqueRepository.listaBloqueados(addFilter);
            res.status(200).json(responseEstoque);
        }
        catch (exception) {
            console.log("Erro ao carregar o registro, exception: " +  exception);
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));            
        }
        finally {
            await connection.close();
        }
    });  

    app.delete('/estoque/:id', function(req,res){     
        let util = new app.util.Util();
        let usuario = req.usuario;
        let errors = [];
        let id = req.params.id;
        let obj = {};
        obj.id = id;
        
        deletaPorId(id, res).then(function(response) {
            res.status(200).json(obj);
            return;      
        });
    });

    function lista(addFilter, res) {
        let q = require('q');
        let d = q.defer();
        let util = new app.util.Util();
        let connection = app.dao.ConnectionFactory();
        let objDAO = new app.dao.EstoqueDAO(connection);

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
 
    function buscarPorId(id,  res) {
        let q = require('q');
        let d = q.defer();
        let util = new app.util.Util();
       
        let connection = app.dao.ConnectionFactory();
        let objDAO = new app.dao.EstoqueDAO(connection);
        let errors =[];
     
        objDAO.buscaPorId(id, function(exception, result){
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "obj");
                res.status(500).send(errors);
                return;
            } else {
                
                d.resolve(result[0]);
            }
        });
        return d.promise;  
    }


    function salvar(obj, res){
        delete obj.id;
        let connection = app.dao.ConnectionFactory();
        let objDAO = new app.dao.EstoqueDAO(connection);
        let q = require('q');
        let d = q.defer();

        objDAO.salva(obj, function(exception, result){
            if(exception){
                console.log('Erro ao inserir', exception);
                res.status(500).send(exception);   
                d.reject(exception);
                return;
            }
            else{   
                d.resolve(result);
            }
        });
        return d.promise; 
    }

    function atualizar(obj, res){
        let id = obj.id;
        delete obj.id;
        let connection = app.dao.ConnectionFactory();
        let objDAO = new app.dao.EstoqueDAO(connection);
        let q = require('q');
        let d = q.defer();

        objDAO.atualiza(obj, id, function(exception, result){
            if(exception){
                console.log('Erro ao alterar o registro', exception);
                res.status(500).send(exception);   
                d.reject(exception);
                return;
            }
            else{   
                d.resolve(result);
            }
        });
        return d.promise; 
    }

    function deletaPorId(id, res) {
        let q = require('q');
        let d = q.defer();
        let util = new app.util.Util();
        let connection = app.dao.ConnectionFactory();
        let objDAO = new app.dao.EstoqueDAO(connection);
        let errors = [];

        objDAO.deletaPorId(id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                errors = util.customError(errors, "data", "Erro ao remover os dados", "obj");
                res.status(500).send(errors);
                return;
            } else {

                d.resolve(result[0]);
            }
        });
        return d.promise;

    }
}