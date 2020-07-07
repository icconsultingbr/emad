module.exports = function(app){
    
    app.get('/tipo-usuario-menu', function(req,res){
        let usuario = req.usuario;
        let util = new app.util.Util();
        let errors = [];

        lista(res).then(function(resposne) {
            res.status(200).json(resposne);
            return;      
        });
    }); 
    
    app.get('/tipo-usuario-menu/tipo-usuario/:id', function(req,res){        
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        listaPorTipoUsuarioId(id, res).then(function(response) {
            res.status(200).json(response);
            return;      
        });
    });
	
	function lista(res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util(); 
        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.TipoUsuarioMenuDAO(connection);

        var errors =[];
     
        objDAO.lista(function(exception, result){
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "tipoUsuarios");
                res.status(500).send(errors);
                return;
            } else {
                d.resolve(result);
            }
        });
        return d.promise;  
    }
    

    function listaPorTipoUsuarioId(id,  res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util(); 
       
        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.TipoUsuarioMenuDAO(connection);
        var errors =[];
     
        objDAO.buscaPorId(id, function(exception, result){
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "tipo-usuario-menu");
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
        var objDAO = new app.dao.TipoUsuarioMenuDAO(connection);
        var errors =[];
     
        objDAO.buscaPorId(id, function(exception, result){
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "tipoUsuario");
                res.status(500).send(errors);
                return;
            } else {
                
                d.resolve(result[0]);
            }
        });
        return d.promise;  
    }  


    function deletaPorId(id, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.TipoUsuarioMenuDAO(connection);
        var errors = [];

        objDAO.deletaPorId(id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                errors = util.customError(errors, "data", "Erro ao remover os dados", "tipo-usuario");
                res.status(500).send(errors);
                return;
            } else {

                d.resolve(result[0]);
            }
        });
        return d.promise;

    }

    function atualizaPorId(obj, id, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var obj = new app.dao.TipoUsuarioMenuDAO(connection);
        var errors = [];

        obj.atualiza(obj, id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao editar os dados", "tipo-usuario");
                res.status(500).send(errors);
                return;
            } else {

                d.resolve(result[0]);
            }
        });
        return d.promise;
    }

    function salva(obj, res) {
        delete obj.id;
        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.TipoUsuarioMenuDAO(connection);
        var q = require('q');
        var d = q.defer();
        objDAO.salva(obj, function (exception, result) {
            if (exception) {
                console.log('Erro ao inserir um grupo de usuário', exception);
                res.status(500).send(exception);
                d.reject(exception);
                return;
            }
            else {
                d.resolve(result);
            }
        });
        return d.promise;
    }
}


