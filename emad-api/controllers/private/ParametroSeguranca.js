module.exports = function (app) {

    app.post('/parametro-seguranca', function(req,res){
        var obj = req.body;
        var usuario = req.usuario; 
        let util = new app.util.Util();
        var errors = [];

        req.assert("nome").notEmpty().withMessage("Nome é um campo Obrigatório");
        req.assert("valor").notEmpty().withMessage("Valor é um campo Obrigatório");

        errors = req.validationErrors();
        
        if(errors){
            res.status(400).send(errors);
            return; 
        }

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

    app.put('/parametro-seguranca', function(req,res){
        var obj = req.body;
        var usuario = req.usuario; 
        let util = new app.util.Util();
        var errors = [];

        req.assert("nome").notEmpty().withMessage("Nome é um campo Obrigatório");
        req.assert("valor").notEmpty().withMessage("Valor é um campo Obrigatório");

        errors = req.validationErrors();
        
        if(errors){
            res.status(400).send(errors);
            return; 
        }

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
   
    app.get('/parametro-seguranca', function (req, res) {
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


    app.get('/parametro-seguranca/:id', function(req,res){        
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

    app.get('/parametro-seguranca/chave/:id', function(req,res){        
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        if(usuario.idTipoUsuario == util.SUPER_ADMIN){		
            buscarValorPorChave(id, res).then(function(response) {
                res.status(200).json(response);
                return;      
            });
        }
        else{
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }
    }); 

    app.delete('/parametro-seguranca/:id', function(req,res){     
        var util = new app.util.Util();
        let usuario = req.usuario;
        let errors = [];
        let id = req.params.id;
        let parametroSeguranca = {};
        parametroSeguranca.id = id;
        
        if(usuario.idTipoUsuario == util.SUPER_ADMIN){	
            deletaPorId(id, res).then(function(response) {
                res.status(200).json(parametroSeguranca);
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
        var ParametroSegurancaDAO = new app.dao.ParametroSegurancaDAO(connection);

        var errors = [];

        ParametroSegurancaDAO.lista(function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "parametroSeguranca");
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
        var ParametroSegurancaDAO = new app.dao.ParametroSegurancaDAO(connection);
        var errors =[];
     
        ParametroSegurancaDAO.buscaPorId(id, function(exception, result){
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "parametroSeguranca");
                res.status(500).send(errors);
                return;
            } else {
                
                d.resolve(result[0]);
            }
        });
        return d.promise;  
    }

    function buscarValorPorChave(id,  res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();
       
        var connection = app.dao.ConnectionFactory();
        var ParametroSegurancaDAO = new app.dao.ParametroSegurancaDAO(connection);
        var errors =[];
     
        ParametroSegurancaDAO.buscarValorPorChave(id, function(exception, result){
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "parametroSeguranca");
                res.status(500).send(errors);
                return;
            } else {
                
                d.resolve(result[0]);
            }
        });
        return d.promise;  
    }


    function salvar(parametroSeguranca, res){
        delete parametroSeguranca.id;
        var connection = app.dao.ConnectionFactory();
        var ParametroSegurancaDAO = new app.dao.ParametroSegurancaDAO(connection);
        var q = require('q');
        var d = q.defer();

        ParametroSegurancaDAO.salva(parametroSeguranca, function(exception, result){
            if(exception){
                console.log('Erro ao inserir Parâmetro de segurança', exception);
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

    function atualizar(parametroSeguranca, res){
        let id = parametroSeguranca.id;
        delete parametroSeguranca.id;
        var connection = app.dao.ConnectionFactory();
        var ParametroSegurancaDAO = new app.dao.ParametroSegurancaDAO(connection);
        var q = require('q');
        var d = q.defer();

        ParametroSegurancaDAO.atualiza(parametroSeguranca, id, function(exception, result){
            if(exception){
                console.log('Erro ao alterar o Parâmetro de segurança', exception);
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
        var ParametroSegurancaDAO = new app.dao.ParametroSegurancaDAO(connection);
        var errors = [];

        ParametroSegurancaDAO.deletaPorId(id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                errors = util.customError(errors, "data", "Erro ao remover os dados", "parametroSeguranca");
                res.status(500).send(errors);
                return;
            } else {

                d.resolve(result[0]);
            }
        });
        return d.promise;

    }
}

