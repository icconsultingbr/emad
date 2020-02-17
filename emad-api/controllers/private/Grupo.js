module.exports = function (app) {

    app.post('/grupo', function(req,res){
        var obj = req.body;
        var usuario = req.usuario; 
        let util = new app.util.Util();
        var errors = [];

        req.assert("nome").notEmpty().withMessage("Nome é um campo Obrigatório");

        errors = req.validationErrors();
        
        if(errors){
            res.status(400).send(errors);
            return; 
        }

        obj.idUsuarioCriacao = usuario.id;
        obj.dataCriacao = new Date;
        var errors = [];

        if(usuario.idTipoUsuario == util.SUPER_ADMIN){
            salvar(obj, res).then(function(response) {
                obj.id = response.insertId;
                res.status(201).send(obj);
            });  

        } else{
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }
    });

    app.put('/grupo', function(req,res){
        var obj = req.body;
        var usuario = req.usuario; 
        let util = new app.util.Util();
        var errors = [];

        req.assert("nome").notEmpty().withMessage("Nome é um campo Obrigatório");

        errors = req.validationErrors();
        
        if(errors){
            res.status(400).send(errors);
            return; 
        }

        obj.idUsuarioCriacao = usuario.id;
        obj.dataCriacao = new Date;
        var errors = [];

        if(usuario.idTipoUsuario == util.SUPER_ADMIN){
            atualizar(obj, res).then(function(response) {
                obj.id = response.insertId;
                res.status(201).send(obj);
            });  

        } else{
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }
    });
   
    app.get('/grupo', function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let errors = [];

        if (usuario.idTipoUsuario == util.SUPER_ADMIN) {
            lista(res).then(function (resposne) {
                res.status(200).json(resposne);
                return;
            });
        }
        else {
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }
    });


    app.get('/grupo/:id', function(req,res){        
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        if(usuario.idTipoUsuario == util.SUPER_ADMIN){		
            buscarPorId(id, res).then(function(response) {
                res.status(200).json(response);
                return;      
            });
        }
        else{
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }
    }); 

    app.delete('/grupo/:id', function(req,res){     
        var util = new app.util.Util();
        let usuario = req.usuario;
        let errors = [];
        let id = req.params.id;
        let grupo = {};
        grupo.id = id;
        
        if(usuario.idTipoUsuario == util.SUPER_ADMIN){	
            deletaPorId(id, res).then(function(response) {
                res.status(200).json(grupo);
                return;      
            });

        } else{
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }
    });

    function lista(res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();
        var connection = app.dao.ConnectionFactory();
        var grupoDAO = new app.dao.GrupoDAO(connection);

        var errors = [];

        grupoDAO.lista(function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "grupos");
                res.status(500).send(errors);
                return;
            } else {
                d.resolve(result);
            }
        });
        return d.promise;
    }
 
    function buscarPorId(id,  res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();
       
        var connection = app.dao.ConnectionFactory();
        var grupoDAO = new app.dao.GrupoDAO(connection);
        var errors =[];
     
        grupoDAO.buscaPorId(id, function(exception, result){
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "grupo");
                res.status(500).send(errors);
                return;
            } else {
                
                d.resolve(result[0]);
            }
        });
        return d.promise;  
    }


    function salvar(grupo, res){
        delete grupo.id;
        var connection = app.dao.ConnectionFactory();
        var grupoDAO = new app.dao.GrupoDAO(connection);
        var q = require('q');
        var d = q.defer();

        grupoDAO.salva(grupo, function(exception, result){
            if(exception){
                console.log('Erro ao inserir Grupo', exception);
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

    function atualizar(grupo, res){
        let id = grupo.id;
        delete grupo.id;
        var connection = app.dao.ConnectionFactory();
        var grupoDAO = new app.dao.GrupoDAO(connection);
        var q = require('q');
        var d = q.defer();

        grupoDAO.atualiza(grupo, id, function(exception, result){
            if(exception){
                console.log('Erro ao alterar o Grupo', exception);
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
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();
        var connection = app.dao.ConnectionFactory();
        var grupoDAO = new app.dao.GrupoDAO(connection);
        var errors = [];

        grupoDAO.deletaPorId(id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                errors = util.customError(errors, "data", "Erro ao apagar os dados", "grupo");
                res.status(500).send(errors);
                return;
            } else {

                d.resolve(result[0]);
            }
        });
        return d.promise;

    }
}

