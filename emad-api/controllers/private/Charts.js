module.exports = function (app) {

    app.get('/atendimentos-quantidade', function(req,res){        
        let usuario = req.usuario;
        let periodo = req.query.periodo;
        let idEstabelecimento = req.query.idEstabelecimento;
        
        let util = new app.util.Util();
        let errors = [];

        if(usuario.idTipoUsuario <= util.SUPER_ADMIN){		
            carregaQtdAtendimentosPorPeriodo(periodo, idEstabelecimento, res).then(function(response) {
                res.status(200).json(response);
                return;      
            });
        }
        else{
            errors = util.customError(errors, "header", "Não autorizado!", "obj");
            res.status(401).send(errors);
        }
    }); 

    app.get('/atendimentos-por-periodo', function(req,res){        
        let usuario = req.usuario;
        let periodo = req.query.periodo;
        let idEstabelecimento = req.query.idEstabelecimento;
        
        let util = new app.util.Util();
        let errors = [];

        if(usuario.idTipoUsuario <= util.SUPER_ADMIN){		
            carregaAtendimentosPorPeriodo(periodo, idEstabelecimento, res).then(function(response) {
                res.status(200).json(response);
                return;      
            });
        }
        else{
            errors = util.customError(errors, "header", "Não autorizado!", "obj");
            res.status(401).send(errors);
        }
    }); 

    app.get('/medicamentos-quantidade', function(req,res){        
        let usuario = req.usuario;
        let periodo = req.query.periodo;
        let idEstabelecimento = req.query.idEstabelecimento;
        
        let util = new app.util.Util();
        let errors = [];

        if(usuario.idTipoUsuario <= util.SUPER_ADMIN){		
            carregaQtdMedicamentosPorPeriodo(periodo, idEstabelecimento, res).then(function(response) {
                res.status(200).json(response);
                return;      
            });
        }
        else{
            errors = util.customError(errors, "header", "Não autorizado!", "obj");
            res.status(401).send(errors);
        }
    }); 

    app.get('/medicamentos-por-periodo', function(req,res){        
        let usuario = req.usuario;
        let periodo = req.query.periodo;
        let idEstabelecimento = req.query.idEstabelecimento;
        
        let util = new app.util.Util();
        let errors = [];

        if(usuario.idTipoUsuario <= util.SUPER_ADMIN){		
            carregaMedicamentosPorPeriodo(periodo, idEstabelecimento, res).then(function(response) {
                res.status(200).json(response);
                return;      
            });
        }
        else{
            errors = util.customError(errors, "header", "Não autorizado!", "obj");
            res.status(401).send(errors);
        }
    }); 

    app.get('/medicamentos-por-periodo', function(req,res){        
        let usuario = req.usuario;
        let periodo = req.query.periodo;
        let idEstabelecimento = req.query.idEstabelecimento;
        
        let util = new app.util.Util();
        let errors = [];

        if(usuario.idTipoUsuario <= util.SUPER_ADMIN){		
            carregaMedicamentosPorPeriodo(periodo, idEstabelecimento, res).then(function(response) {
                res.status(200).json(response);
                return;      
            });
        }
        else{
            errors = util.customError(errors, "header", "Não autorizado!", "obj");
            res.status(401).send(errors);
        }
    }); 

    app.get('/tipo-atendimento-por-periodo', function(req,res){        
        let usuario = req.usuario;
        let periodo = req.query.periodo;
        let idEstabelecimento = req.query.idEstabelecimento;
        
        let util = new app.util.Util();
        let errors = [];

        if(usuario.idTipoUsuario <= util.SUPER_ADMIN){		
            carregaTipoAtendimentoPorPeriodo(periodo, idEstabelecimento, res).then(function(response) {
                res.status(200).json(response);
                return;      
            });
        }
        else{
            errors = util.customError(errors, "header", "Não autorizado!", "obj");
            res.status(401).send(errors);
        }
    }); 

    app.get('/tipo-atendimento-existente-por-periodo', function(req,res){        
        let usuario = req.usuario;
        let periodo = req.query.periodo;
        let idEstabelecimento = req.query.idEstabelecimento;
        
        let util = new app.util.Util();
        let errors = [];

        if(usuario.idTipoUsuario <= util.SUPER_ADMIN){		
            carregaTipoAtendimentoExistentesPorPeriodo(periodo, idEstabelecimento, res).then(function(response) {
                res.status(200).json(response);
                return;      
            });
        }
        else{
            errors = util.customError(errors, "header", "Não autorizado!", "obj");
            res.status(401).send(errors);
        }
    }); 
         
    app.get('/atendimento-situacao-por-periodo', function(req,res){        
        let usuario = req.usuario;
        let periodo = req.query.periodo;
        let idEstabelecimento = req.query.idEstabelecimento;
        
        let util = new app.util.Util();
        let errors = [];

        if(usuario.idTipoUsuario <= util.SUPER_ADMIN){		
            carregaAtendimentoSituacaoPorPeriodo(periodo, idEstabelecimento, res).then(function(response) {
                res.status(200).json(response);
                return;      
            });
        }
        else{
            errors = util.customError(errors, "header", "Não autorizado!", "obj");
            res.status(401).send(errors);
        }
    }); 

    app.get('/atendimento-situacao-existente-por-periodo', function(req,res){        
        let usuario = req.usuario;
        let periodo = req.query.periodo;
        let idEstabelecimento = req.query.idEstabelecimento;
        
        let util = new app.util.Util();
        let errors = [];

        if(usuario.idTipoUsuario <= util.SUPER_ADMIN){		
            carregaAtendimentoSituacaoExistentesPorPeriodo(periodo, idEstabelecimento, res).then(function(response) {
                res.status(200).json(response);
                return;      
            });
        }
        else{
            errors = util.customError(errors, "header", "Não autorizado!", "obj");
            res.status(401).send(errors);
        }
    }); 

    function carregaQtdAtendimentosPorPeriodo(periodo, idEstabelecimento, res) {
        let q = require('q');
        let d = q.defer();
        let util = new app.util.Util();
       
        let connection = app.dao.ConnectionFactory();
        let objDAO = new app.dao.AtendimentoDAO(connection);
        let errors =[];
     
        objDAO.carregaQtdAtendimentosPorPeriodo(periodo, idEstabelecimento, function(exception, result){
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

    function carregaAtendimentosPorPeriodo(periodo, idEstabelecimento, res) {
        let q = require('q');
        let d = q.defer();
        let util = new app.util.Util();
       
        let connection = app.dao.ConnectionFactory();
        let objDAO = new app.dao.AtendimentoDAO(connection);
        let errors =[];
     
        objDAO.carregaAtendimentosPorPeriodo(periodo, idEstabelecimento, function(exception, result){
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

    function carregaQtdMedicamentosPorPeriodo(periodo, idEstabelecimento, res) {
        let q = require('q');
        let d = q.defer();
        let util = new app.util.Util();
       
        let connection = app.dao.ConnectionFactory();
        let objDAO = new app.dao.AtendimentoMedicamentoDAO(connection);
        let errors =[];
     
        objDAO.carregaQtdMedicamentosPorPeriodo(periodo, idEstabelecimento, function(exception, result){
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

    function carregaMedicamentosPorPeriodo(periodo, idEstabelecimento, res) {
        let q = require('q');
        let d = q.defer();
        let util = new app.util.Util();
       
        let connection = app.dao.ConnectionFactory();
        let objDAO = new app.dao.AtendimentoMedicamentoDAO(connection);
        let errors =[];
     
        objDAO.carregaMedicamentosPorPeriodo(periodo, idEstabelecimento, function(exception, result){
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

    function carregaTipoAtendimentoPorPeriodo(periodo, idEstabelecimento, res) {
        let q = require('q');
        let d = q.defer();
        let util = new app.util.Util();
       
        let connection = app.dao.ConnectionFactory();
        let objDAO = new app.dao.AtendimentoDAO(connection);
        let errors =[];
     
        objDAO.carregaTipoAtendimentoPorPeriodo(periodo, idEstabelecimento, function(exception, result){
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
    
    function carregaTipoAtendimentoExistentesPorPeriodo(periodo, idEstabelecimento, res) {
        let q = require('q');
        let d = q.defer();
        let util = new app.util.Util();
       
        let connection = app.dao.ConnectionFactory();
        let objDAO = new app.dao.AtendimentoDAO(connection);
        let errors =[];
     
        objDAO.carregaTipoAtendimentoExistentesPorPeriodo(periodo, idEstabelecimento, function(exception, result){
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

    function carregaAtendimentoSituacaoPorPeriodo(periodo, idEstabelecimento, res) {
        let q = require('q');
        let d = q.defer();
        let util = new app.util.Util();
       
        let connection = app.dao.ConnectionFactory();
        let objDAO = new app.dao.AtendimentoDAO(connection);
        let errors =[];
     
        objDAO.carregaAtendimentoSituacaoPorPeriodo(periodo, idEstabelecimento, function(exception, result){
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
    
    function carregaAtendimentoSituacaoExistentesPorPeriodo(periodo, idEstabelecimento, res) {
        let q = require('q');
        let d = q.defer();
        let util = new app.util.Util();
       
        let connection = app.dao.ConnectionFactory();
        let objDAO = new app.dao.AtendimentoDAO(connection);
        let errors =[];
     
        objDAO.carregaAtendimentoSituacaoExistentesPorPeriodo(periodo, idEstabelecimento, function(exception, result){
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
}