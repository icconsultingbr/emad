module.exports = function(app){
    
    app.get('/municipio', function(req,res){
        let usuario = req.usuario;
        let util = new app.util.Util();
        let errors = [];

        if(usuario.idTipoUsuario == util.SUPER_ADMIN){
            lista(res).then(function(resposne) {
                res.status(200).json(resposne);
                return;      
            });
        }
        else{
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }
    }); 

    app.get('/municipio/:id', function(req,res){        
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

    app.get('/municipio/uf/:id', function(req,res){        
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];
	
        buscarPorUfId(id, res).then(function(response) {
            res.status(200).json(response);
            return;      
        });
    }); 

	
	function lista(res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util(); 
        var connection = app.dao.ConnectionFactory();
        var municipioDAO = new app.dao.MunicipioDAO(connection);

        var errors =[];
     
        municipioDAO.lista(function(exception, result){
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "municipios");
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
        var municipioDAO = new app.dao.MunicipioDAO(connection);
        var errors =[];
     
        municipioDAO.buscaPorId(id, function(exception, result){
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "municipio");
                res.status(500).send(errors);
                return;
            } else {
                
                d.resolve(result[0]);
            }
        });
        return d.promise;  
    }

    function buscarPorUfId(id,  res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();
       
        var connection = app.dao.ConnectionFactory();
        var municipioDAO = new app.dao.MunicipioDAO(connection);
        var errors =[];
     
        municipioDAO.buscaPorUfId(id, function(exception, result){
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "municipio");
                res.status(500).send(errors);
                return;
            } else {
                
                d.resolve(result);
            }
        });
        return d.promise;  
    }

    
}


