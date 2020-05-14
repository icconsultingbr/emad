module.exports = function (app) {

    app.post('/tipo-ficha', function(req,res){
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

    app.put('/tipo-ficha', function(req,res){
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
   
    app.get('/tipo-ficha', function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let errors = [];

        if (usuario.idTipoUsuario <= 3) {
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


    app.get('/tipo-ficha/:id', function(req,res){        
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        if(usuario.idTipoUsuario <= util.SUPER_ADMIN){		
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

    app.delete('/tipo-ficha/:id', function(req,res){     
        var util = new app.util.Util();
        let usuario = req.usuario;
        let errors = [];
        let id = req.params.id;
        let tipoFicha = {};
        tipoFicha.id = id;
        
        if(usuario.idTipoUsuario <= util.SUPER_ADMIN){	
            deletaPorId(id, res).then(function(response) {
                res.status(200).json(tipoFicha);
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
        var TipoFichaDAO = new app.dao.TipoFichaDAO(connection);

        var errors = [];

        TipoFichaDAO.lista(function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "tipoFicha");
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
        var TipoFichaDAO = new app.dao.TipoFichaDAO(connection);
        var errors =[];
     
        TipoFichaDAO.buscaPorId(id, function(exception, result){
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "tipoFicha");
                res.status(500).send(errors);
                return;
            } else {
                
                d.resolve(result[0]);
            }
        });
        return d.promise;  
    }


    function salvar(tipoFicha, res){
        delete tipoFicha.id;
        var connection = app.dao.ConnectionFactory();
        var TipoFichaDAO = new app.dao.TipoFichaDAO(connection);
        var q = require('q');
        var d = q.defer();

        TipoFichaDAO.salva(tipoFicha, function(exception, result){
            if(exception){
                console.log('Erro ao inserir Tipo da ficha', exception);
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

    function atualizar(tipoFicha, res){
        let id = tipoFicha.id;
        delete tipoFicha.id;
        var connection = app.dao.ConnectionFactory();
        var TipoFichaDAO = new app.dao.TipoFichaDAO(connection);
        var q = require('q');
        var d = q.defer();

        TipoFichaDAO.atualiza(tipoFicha, id, function(exception, result){
            if(exception){
                console.log('Erro ao alterar o Tipo da ficha', exception);
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
        var TipoFichaDAO = new app.dao.TipoFichaDAO(connection);
        var errors = [];

        TipoFichaDAO.deletaPorId(id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                errors = util.customError(errors, "data", "Erro ao remover os dados", "tipoFicha");
                res.status(500).send(errors);
                return;
            } else {

                d.resolve(result[0]);
            }
        });
        return d.promise;

    }
}

