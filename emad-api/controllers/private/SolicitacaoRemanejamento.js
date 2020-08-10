const { v4: uuidv4 } = require('uuid');

module.exports = function (app) {

    app.post('/solicitacao-remanejamento', async function(req,res){
        let obj = req.body;
        let usuario = req.usuario; 
        let util = new app.util.Util();
        let errors = [];

        req.assert("idEstabelecimentoSolicitada").notEmpty().withMessage("O campo Unidade solicitada é um campo obrigatório");
        req.assert("idEstabelecimentoSolicitante").notEmpty().withMessage("O campo Unidade solicitante é um campo obrigatório");

        errors = req.validationErrors();
        
        if(errors){
            res.status(400).send(errors);
            return; 
        }

        obj.dataCriacao = new Date;
        obj.idUsuarioCriacao = usuario.id;
        obj.situacao = 1;

        const connection = await app.dao.connections.EatendConnection.connection();

        const solicitacaoRemanejamentoRepository = new app.dao.SolicitacaoRemanejamentoDAO(connection);

        try {
            await connection.beginTransaction();
            
            var response = await solicitacaoRemanejamentoRepository.salva(obj);
            obj.id = response[0].insertId;
            
            res.status(201).send(obj);

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

    app.put('/solicitacao-remanejamento', async function(req,res){
        let obj = req.body;
        let usuario = req.usuario; 
        let util = new app.util.Util();
        let errors = [];

        req.assert("idEstabelecimentoSolicitada").notEmpty().withMessage("O campo Unidade solicitada é um campo obrigatório");
        req.assert("idEstabelecimentoSolicitante").notEmpty().withMessage("O campo Unidade solicitante é um campo obrigatório");
        
        errors = req.validationErrors();
        
        if(errors){
            res.status(400).send(errors);
            return; 
        }

        obj.dataAlteracao = new Date;
        obj.idUsuarioAlteracao = usuario.id;
        
        const connection = await app.dao.connections.EatendConnection.connection();

        const solicitacaoRemanejamentoRepository = new app.dao.SolicitacaoRemanejamentoDAO(connection);
        const itemSolicitacaoRemanejamentoRepository = new app.dao.ItemSolicitacaoRemanejamentoDAO(connection);

        try {
            await connection.beginTransaction();
            
            obj.situacao = obj.situacao == 5 ? obj.situacao : obj.itensSolicitacaoRemanejamento.length > 0 ? 2 : 1;

            var response = await solicitacaoRemanejamentoRepository.atualiza(obj, obj.id);

            if(obj.itensSolicitacaoRemanejamento && obj.itensSolicitacaoRemanejamento.length > 0){
                
                for (const itemSolicitacaoRemanejamento of obj.itensSolicitacaoRemanejamento) {  
                    itemSolicitacaoRemanejamento.dataCriacao = new Date;
                    itemSolicitacaoRemanejamento.idUsuarioCriacao = usuario.id;
                    itemSolicitacaoRemanejamento.situacao = 1;//FINALIZADO
                    
                    if(itemSolicitacaoRemanejamento.id){                      
                        delete itemSolicitacaoRemanejamento.dataCriacao;
                        delete itemSolicitacaoRemanejamento.idUsuarioCriacao;
                        itemSolicitacaoRemanejamento.dataAlteracao = new Date;
                        itemSolicitacaoRemanejamento.idUsuarioAlteracao = usuario.id;
                        var item = await itemSolicitacaoRemanejamentoRepository.atualiza(itemSolicitacaoRemanejamento);  
                    }
                    else{
                        var responseItemSolicitacaoRemanejamento = await itemSolicitacaoRemanejamentoRepository.salva(itemSolicitacaoRemanejamento);    
                        itemSolicitacaoRemanejamento.id = responseItemSolicitacaoRemanejamento[0].insertId; 
                    }
                }
            } else{
                res.status(400).send(util.customError(errors, "header", "Nenhum material informado", ""));
                await connection.rollback();                
            }
            await connection.commit();
            res.status(201).send(obj);            
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado" + exception, ""));
            await connection.rollback();
        }
        finally {
            await connection.close();
        }
    });   
       
    app.put('/solicitacao-remanejamento/atender', async function (req, res) {
        let solicitacaoRemanejamento = req.body;
        let movimentoGeral = {};
        let nomeEstabelecimento;
        let existeRemanejamento = false;

        const guid =  uuidv4();

        let usuario = req.usuario;
        const util = new app.util.Util();
        let errors = [];

        req.assert("id").notEmpty().withMessage("Solicitação de remanejamento não encontrada");
                
        errors = req.validationErrors();

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        const connection = await app.dao.connections.EatendConnection.connection();

        const estoqueRepository = new app.dao.EstoqueDAO(connection);
        const estabelecimentoRepository = new app.dao.EstabelecimentoDAO(connection);
        const movimentoGeralRepository = new app.dao.MovimentoGeralDAO(connection);
        const itemMovimentoGeralRepository = new app.dao.ItemMovimentoGeralDAO(connection);
        const tipoMovimentoRepository = new app.dao.TipoMovimentoDAO(connection);
        const movimentoLivroRepository = new app.dao.MovimentoLivroDAO(connection);
        const solicitacaoRemanejamentoRepository = new app.dao.SolicitacaoRemanejamentoDAO(connection);
        const itemSolicitacaoRemanejamentoRepository = new app.dao.ItemSolicitacaoRemanejamentoDAO(connection);

        try {
            await connection.beginTransaction();
            
            var nomeTipoMovimento = "";
            var operacaoTipoMovimento = "";

            movimentoGeral.numeroDocumento = solicitacaoRemanejamento.id;
            movimentoGeral.idTipoMovimento = solicitacaoRemanejamento.idTipoMovimento;
            
            var responseTipoMovimento = await tipoMovimentoRepository.carregaPorId(movimentoGeral.idTipoMovimento);
            if(responseTipoMovimento){
                nomeTipoMovimento = responseTipoMovimento.nome;
                operacaoTipoMovimento = responseTipoMovimento.operacao;
            }

            var responseEstabelecimento = await estabelecimentoRepository.carregaPorId(solicitacaoRemanejamento.idEstabelecimentoSolicitante);
            if(responseEstabelecimento){
                nomeEstabelecimento = responseEstabelecimento.nomeFantasia;                
            }            

            movimentoGeral.idUsuario = usuario.id;
            movimentoGeral.idReceita = null;
            movimentoGeral.idPaciente = null;            
            movimentoGeral.numeroControle = guid;                                    
            movimentoGeral.dataMovimento = new Date;
            movimentoGeral.dataCriacao = new Date;
            movimentoGeral.idUsuarioCriacao = usuario.id;
            movimentoGeral.situacao = 1;
            movimentoGeral.idEstabelecimento = solicitacaoRemanejamento.idTipoMovimento == 5 ? solicitacaoRemanejamento.idEstabelecimentoSolicitante : solicitacaoRemanejamento.idEstabelecimentoSolicitada;

            var response = await movimentoGeralRepository.salva(movimentoGeral);

            movimentoGeral.id = response[0].insertId;

            for (const itemSolicitacao of solicitacaoRemanejamento.itensSolicitacaoRemanejamento) {

                //EFETIVAR UM REMANEJAMENTO
                if(solicitacaoRemanejamento.idTipoMovimento == 5){
                    var responseEstoque = await itemMovimentoGeralRepository.buscarReservaRemanejamento(solicitacaoRemanejamento.id, itemSolicitacao.id);
                    itemSolicitacao.itensEstoque = responseEstoque;
                } else{
                    itemSolicitacao.dataAlteracao = new Date();
                    itemSolicitacao.idUsuarioAlteracao = usuario.id;

                    var responseItem = await itemSolicitacaoRemanejamentoRepository.atualiza(itemSolicitacao);
                }                

                for (const itemMovimento of itemSolicitacao.itensEstoque) {

                    existeRemanejamento = true;

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
                    itemMovimentoGeral.idFabricante = itemMovimento.idFabricante ? itemMovimento.idFabricante : itemMovimento.idFabricanteMaterial;
                    itemMovimentoGeral.idFabricanteMaterial = itemMovimento.idFabricante ? itemMovimento.idFabricante : itemMovimento.idFabricanteMaterial;
                    itemMovimentoGeral.lote = itemMovimento.lote;
                    itemMovimentoGeral.validade = itemMovimento.validade;
                    itemMovimentoGeral.quantidade = (solicitacaoRemanejamento.idTipoMovimento == 5) ? parseInt(itemMovimento.quantidade) : parseInt(itemMovimento.qtdDispensar);
                    itemMovimentoGeral.idItemReceita = null;
                    itemMovimentoGeral.idEstabelecimento = movimentoGeral.idEstabelecimento;
                    itemMovimentoGeral.itemSolicitacaoRemanejamento = itemSolicitacao.id;

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
                            qtd = (qtdEstoque > 0 ? qtdEstoque : 0) + itemMovimentoGeral.quantidade;                                                       
                        else
                            qtd = (qtdEstoque > 0 ? qtdEstoque : 0) - itemMovimentoGeral.quantidade;  
                                                
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
                        novoEstoque.idFabricanteMaterial = itemMovimento.idFabricante ? itemMovimento.idFabricante : itemMovimento.idFabricanteMaterial;
                        novoEstoque.idMaterial = itemMovimento.idMaterial;
                        novoEstoque.idEstabelecimento = movimentoGeral.idEstabelecimento;
                        novoEstoque.lote = itemMovimento.lote;
                        novoEstoque.validade = new Date(itemMovimento.validade);
                        novoEstoque.quantidade = itemMovimentoGeral.quantidade;
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

                    saldoEntregue = itemMovimentoGeral.quantidade;               
                    
                    saldoAtualUnidade = await estoqueRepository.carregaQuantidadePorMaterialEstabelecimento(itemMovimentoGeral);

                    var responseMovimentoLivro = await movimentoLivroRepository.carregaLivroPorMovimento(itemMovimentoGeral);
                    
                    if(responseMovimentoLivro.length > 0){
                        if(operacaoTipoMovimento == '1'){
                            var qtdeEntradaLivro =parseInt( responseMovimentoLivro[0].quantidadeEntrada) + itemMovimentoGeral.quantidade;
                            var responseAtualizacaoMovimentoLivro = await movimentoLivroRepository.atualizaEntrada(qtdeEntradaLivro, saldoAtualUnidade, itemMovimentoGeral, usuario.id);
                        }else{
                            var qtdeSaidaLivro = parseInt(responseMovimentoLivro[0].quantidadeSaida) + itemMovimentoGeral.quantidade;
                            var responseAtualizacaoMovimentoLivro = await movimentoLivroRepository.atualizaSaida(qtdeSaidaLivro, saldoAtualUnidade, itemMovimentoGeral, usuario.id);
                        }
                    }
                    else{                        
                        var historico = nomeTipoMovimento + " a partir da solicitação: " + movimentoGeral.numeroDocumento + " da unidade " + nomeEstabelecimento;

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
            }

            if(existeRemanejamento){

                solicitacaoRemanejamento.dataAlteracao = new Date();
                solicitacaoRemanejamento.idUsuarioAlteracao = usuario.id;
    
                var response = await solicitacaoRemanejamentoRepository.atualiza(solicitacaoRemanejamento, solicitacaoRemanejamento.id);
    
            }
            else{
                res.status(400).send(util.customError(errors, "header", "Nenhum item possui Lote/Fabricante para ser remanejado", ""));
                await connection.rollback();
                return;
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

    app.get('/solicitacao-remanejamento/pendente', async function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let errors = [];
        let addFilter = req.query;        
        
        const connection = await app.dao.connections.EatendConnection.connection();

        const solicitacaoRemanejamentoRepository = new app.dao.SolicitacaoRemanejamentoDAO(connection);

        try {
            var response = await solicitacaoRemanejamentoRepository.lista(addFilter, true);
            res.status(201).send(response);
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado" + exception, ""));
        }
        finally {
            await connection.close();
        }
    });

    app.get('/solicitacao-remanejamento/atender', async function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let errors = [];
        let addFilter = req.query;               

        const connection = await app.dao.connections.EatendConnection.connection();

        const solicitacaoRemanejamentoRepository = new app.dao.SolicitacaoRemanejamentoDAO(connection);

        try {
            var response = await solicitacaoRemanejamentoRepository.lista(addFilter, false);
            res.status(201).send(response);
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado" + exception, ""));
        }
        finally {
            await connection.close();
        }
    });

    app.get('/solicitacao-remanejamento/:id', async function(req,res){        
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        const connection = await app.dao.connections.EatendConnection.connection();

        const solicitacaoRemanejamentoRepository = new app.dao.SolicitacaoRemanejamentoDAO(connection);
        const itemSolicitacaoRemanejamentoRepository = new app.dao.ItemSolicitacaoRemanejamentoDAO(connection);

        try {
            var responseSolicitacaoRemanejamento = await solicitacaoRemanejamentoRepository.buscaPorId(id);
            var solicitacao = responseSolicitacaoRemanejamento[0];
            
         var itensSolicitacaoRemanejamento = await itemSolicitacaoRemanejamentoRepository.buscarPorSolicitacaoRemanejamento(id);            
         solicitacao.itensSolicitacaoRemanejamento = itensSolicitacaoRemanejamento ? itensSolicitacaoRemanejamento : null;

            res.status(201).send(solicitacao);
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado" + exception, ""));
        }
        finally {
            await connection.close();
        }
    }); 

    app.delete('/solicitacao-remanejamento/:id', async function(req,res){     
        let util = new app.util.Util();
        let usuario = req.usuario;
        let errors = [];
        let id = req.params.id;
        let obj = {};
        obj.id = id;

        const connection = await app.dao.connections.EatendConnection.connection();

        const solicitacaoRemanejamentoRepository = new app.dao.SolicitacaoRemanejamentoDAO(connection);

        try {
            await connection.beginTransaction();
            
            var response = await solicitacaoRemanejamentoRepository.deletaPorId(obj.id);
            res.status(201).send(obj);

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
}