module.exports = function (app) {
  
    app.post('/produto-exame', async function(req,res){
        let obj = req.body;
        let usuario = req.usuario; 
        let errors = [];

        req.assert("idTipoExame").notEmpty().withMessage("O campo Tipo de exame é um campo obrigatório");
        req.assert("idTipoExame").matches(/^[0-9]+$/).withMessage("O campo Tipo de exame deve conter somente números");
        req.assert("nome").notEmpty().withMessage("O campo Nome é um campo obrigatório");
        req.assert("nome").isLength({ min: 0, max: 50 }).withMessage("O campo Nome deve ter no máximo 50 caractere(s)");

        errors = req.validationErrors();
        
        if(errors){
            res.status(400).send(errors);
            return; 
        }

        const connection = await app.dao.connections.EatendConnection.connection();
        const repository = new app.dao.ProdutoExameDAO(connection);

        try {
            obj.dataCriacao = new Date;
            obj.idUsuarioCriacao = usuario.id;

            var response = await repository.salvaSync(obj);
            obj.id = response[0].insertId;
            res.status(201).send(obj);
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado " + exception, ""));
        }
        finally {
            await connection.close();
        }
    });

    app.put('/produto-exame', async function(req,res){
        let util = new app.util.Util();
        let obj = req.body;        
        let usuario = req.usuario; 
        let errors = [];

        req.assert("idTipoExame").notEmpty().withMessage("O campo Tipo de exame é um campo obrigatório");
        req.assert("nome").notEmpty().withMessage("O campo Nome é um campo obrigatório");
        req.assert("nome").isLength({ min: 0, max: 50 }).withMessage("O campo Nome deve ter no máximo 50 caractere(s)");
        
        errors = req.validationErrors();
        
        if(errors){
            res.status(400).send(errors);
            return; 
        }

        const connection = await app.dao.connections.EatendConnection.connection();
        const repository = new app.dao.ProdutoExameDAO(connection);

        try {
            obj.dataAlteracao = new Date;
            obj.idUsuarioAlteracao = usuario.id;

            await repository.atualizaSync(obj);
            res.status(201).send(obj);
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado " + exception, ""));
        }
        finally {
            await connection.close();
        }
    });
   
    app.get('/produto-exame', async function (req, res) {
        let util = new app.util.Util();
        let errors = [];
        let queryFilter = req.query;

        const connection = await app.dao.connections.EatendConnection.connection();
        
        try {
            const repository = new app.dao.ProdutoExameDAO(connection);
            const response = await repository.listaAsync(queryFilter);

            res.status(200).json(response);
        }
        catch (exception) {
            errors = util.customError(errors, "data", "Erro ao acessar os dados", "objs");
            res.status(500).send(errors);
        }
        finally{
            await connection.close();
        }
    });

    app.get('/produto-exame/:id', async function(req,res){        
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        const connection = await app.dao.connections.EatendConnection.connection();
        
        try {
            const repository = new app.dao.ProdutoExameDAO(connection);
            const response = await repository.buscaPorIdSync(id);

            res.status(200).json(response);
        }
        catch (exception) {
            errors = util.customError(errors, "data", "Erro ao acessar os dados", "objs");
            res.status(500).send(errors);
        }
        finally{
            await connection.close();
        }
    }); 

    app.get('/produto-exame/tipo-exame/:id', async function (req, res) {
        let util = new app.util.Util();
        let errors = [];
        let idTipoExame = req.params.id;

        const connection = await app.dao.connections.EatendConnection.connection();
        
        try {
            const repository = new app.dao.ProdutoExameDAO(connection);
            const response = await repository.listaDominio(idTipoExame);

            res.status(200).json(response);
        }
        catch (exception) {
            errors = util.customError(errors, "data", "Erro ao acessar os dados", "objs");
            res.status(500).send(errors);
        }
        finally{
            await connection.close();
        }
    });

    app.delete('/produto-exame/:id', async function(req,res){     
        let util = new app.util.Util();
        let id = req.params.id;      
        let usuario = req.usuario; 
        let errors = [];
        let obj = {};

        const connection = await app.dao.connections.EatendConnection.connection();
        const repository = new app.dao.ProdutoExameDAO(connection);

        try {
            obj.dataAlteracao = new Date;
            obj.idUsuarioAlteracao = usuario.id;
            obj.situacao = false;
            obj.id = id;

            await repository.atualizaSync(obj);
            res.status(201).send(obj);
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado " + exception, ""));
        }
        finally {
            await connection.close();
        }
    });
}