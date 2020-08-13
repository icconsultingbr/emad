module.exports = function (app) {

    const _table = "tb_tipo_movimento";

    app.post('/tipo-movimento', function(req,res){
        let obj = req.body;
        let usuario = req.usuario; 
        let util = new app.util.Util();
        let errors = [];

        req.assert("nome").notEmpty().withMessage("O campo Nome é um campo obrigatório");
        req.assert("nome").isLength({ min: 0, max: 40 }).withMessage("O campo Nome deve ter no máximo 40 caractere(s)");
        req.assert("operacao").notEmpty().withMessage("O campo Operação é um campo obrigatório");

        errors = req.validationErrors();
        
        if(errors){
            res.status(400).send(errors);
            return; 
        }

        obj.dataCriacao = new Date;
        obj.idUsuarioCriacao = usuario.id;

        salvar(obj, res).then(function(response) {
            obj.id = response.insertId;
            res.status(201).send(obj);
        });  
    });

    app.put('/tipo-movimento', function(req,res){
        let obj = req.body;
        let usuario = req.usuario; 
        let util = new app.util.Util();
        let errors = [];

        req.assert("nome").notEmpty().withMessage("O campo Nome é um campo obrigatório");
        req.assert("nome").isLength({ min: 0, max: 40 }).withMessage("O campo Nome deve ter no máximo 40 caractere(s)");
        req.assert("operacao").notEmpty().withMessage("O campo Operação é um campo obrigatório");
        
        errors = req.validationErrors();
        
        if(errors){
            res.status(400).send(errors);
            return; 
        }

        obj.dataAlteracao = new Date;
        obj.idUsuarioAlteracao = usuario.id;

        atualizar(obj, res).then(function(response) {
            obj.id = response.insertId;
            res.status(201).send(obj);
        }); 
    });
   
    app.get('/tipo-movimento', function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let errors = [];
        
        lista(res).then(function (resposne) {
            res.status(200).json(resposne);
            return;
        });
    });

    app.get('/tipo-movimento/administrativo', async function (req, res) {        
        let util = new app.util.Util();
        let errors = [];

        const connection = await app.dao.connections.EatendConnection.connection();

        const tipoMovimentoRespository = new app.dao.TipoMovimentoDAO(connection);

        try {            
            var response = await tipoMovimentoRespository.carregaListaMovimentoAdministrativo();
            res.status(200).json(response);
        }
        catch (exception) {
            console.log("Erro ao carregar o registro, exception: " +  exception);
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));            
        }
        finally {
            await connection.close();
        }
    });   

    app.get('/tipo-movimento/operacao/:idOperacao', async function (req, res) {        
        let util = new app.util.Util();
        let errors = [];
        let idOperacao = req.params.idOperacao;

        const connection = await app.dao.connections.EatendConnection.connection();

        const tipoMovimentoRespository = new app.dao.TipoMovimentoDAO(connection);

        try {            
            var response = await tipoMovimentoRespository.carregaListaPorOperacao(idOperacao);
            res.status(200).json(response);
        }
        catch (exception) {
            console.log("Erro ao carregar o registro, exception: " +  exception);
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));            
        }
        finally {
            await connection.close();
        }
    });     

    app.get('/tipo-movimento/:id', function(req,res){        
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        buscarPorId(id, res).then(function(response) {
            res.status(200).json(response);
            return;      
        });
    }); 

    app.delete('/tipo-movimento/:id', function(req,res){     
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

    function lista(res) {
        let q = require('q');
        let d = q.defer();
        let util = new app.util.Util();
        let connection = app.dao.ConnectionFactory();
        let objDAO = new app.dao.GenericDAO(connection, _table);

        let errors = [];

        objDAO.lista(function (exception, result) {
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
        let objDAO = new app.dao.GenericDAO(connection, _table);
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
        let objDAO = new app.dao.GenericDAO(connection, _table);
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
        let objDAO = new app.dao.GenericDAO(connection, _table);
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
        let objDAO = new app.dao.GenericDAO(connection, _table);
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