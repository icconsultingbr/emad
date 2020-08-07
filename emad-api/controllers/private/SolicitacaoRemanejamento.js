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