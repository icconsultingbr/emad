module.exports = function (app) {

    const _table = "tb_ausencia_profissional";

    app.get('/ausencia-profissional/:id', function (req, res) {
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        if (usuario.idTipoUsuario == util.SUPER_ADMIN) {
            buscarPorId(id, res).then(function (response) {
                res.status(200).json(response);
                return;
            });
        } else {
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }
    });

    app.post('/ausencia-profissional', function (req, res) {
        var obj = req.body;
        var usuario = req.usuario;
        var util = new app.util.Util();
        var errors = [];
        let idEstabelecimento = req.params.idEstabelecimento;

        if (usuario.idTipoUsuario == util.SUPER_ADMIN) {            
            req.assert("idProfissional").notEmpty().withMessage("Profissional é um campo obrigatório");
            req.assert("idTipoAusencia").notEmpty().withMessage("Tipo da ausência é um campo obrigatório");            
            req.assert("periodoInicial").notEmpty().withMessage("Período inicial é um campo obrigatório");
            req.assert("periodoFinal").notEmpty().withMessage("Período final é um campo obrigatório");
            
            var errors = req.validationErrors();

            if (errors) {
                res.status(400).send(errors);
                return;
            }

            obj.dataCriacao = new Date;

            salva(obj, res).then(function(response) {
                obj.id = response.insertId;
                res.status(201).send(obj);
            });  

        } else {
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }
    });

    app.put('/ausencia-profissional', function (req, res) {
        let usuario = req.usuario;
        let obj = req.body;
        let util = new app.util.Util();
        let errors = [];
        let id = obj.id;
        let idEstabelecimento = req.params.idEstabelecimento;

        if (usuario.idTipoUsuario == util.SUPER_ADMIN) {
            req.assert("idProfissional").notEmpty().withMessage("Profissional é um campo obrigatório");
            req.assert("idTipoAusencia").notEmpty().withMessage("Tipo da ausência é um campo obrigatório");
            req.assert("periodoInicial").notEmpty().withMessage("Período inicial é um campo obrigatório");
            req.assert("periodoFinal").notEmpty().withMessage("Período final é um campo obrigatório");

            errors = req.validationErrors();

            if (errors) {
                res.status(400).send(errors);
                return;
            }
            atualizaPorId(obj, id, res).then(function(response) {
                id = id;
                res.status(201).send(obj);
            });
        } else {
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }
    });

    app.delete('/ausencia-profissional/:id', function (req, res) {
        var util = new app.util.Util();
        let usuario = req.usuario;
        let errors = [];
        let id = req.params.id;
        let obj = {};
        obj.id = id;

        if (usuario.idTipoUsuario == util.SUPER_ADMIN) {
            deletaPorId(id, res).then(function (response) {
                res.status(200).json(obj);
                return;
            });

        } else {
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }
    });

    app.get('/ausencia-profissional/profissional/:idProfissional', function(req,res){        
        let usuario = req.usuario;
        let id = req.params.id;
        let idProfissional = req.params.idProfissional;
        let util = new app.util.Util();
        let errors = [];


        if(usuario.idTipoUsuario == util.SUPER_ADMIN){		
            buscarAusenciaPorProfissionalId(idProfissional, res).then(function(response) {
                res.status(200).json(response);
                return;      
            });
        }
        else{
            errors = util.customError(errors, "header", "Não autorizado!", "obj");
            res.status(401).send(errors);
        }
    }); 

    function buscarAusenciaPorProfissionalId(id, res) {
        let q = require('q');
        let d = q.defer();
        let util = new app.util.Util();
       
        let connection = app.dao.ConnectionFactory();
        let objDAO = new app.dao.AusenciaProfissionalDAO(connection, _table);
        let errors =[];
     
        objDAO.buscaPorProfissionalId(id, function(exception, result){
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

    function buscarPorId(id, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.AusenciaProfissionalDAO(connection);
        var errors = [];

        objDAO.buscaPorId(id, function (exception, result) {
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

    function deletaPorId(id, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.AusenciaProfissionalDAO(connection);
        var errors = [];

        objDAO.deletaPorId(id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                errors = util.customError(errors, "data", "Erro ao remover os dados", "Ausência do profissional");
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
        var objDAO = new app.dao.AusenciaProfissionalDAO(connection);
        var errors = [];

        objDAO.atualiza(obj, id, function (exception, result) {

            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao editar os dados", "Ausência do profissional");
                res.status(500).send(errors);
                return;
            } else {
                d.resolve(result[0]);
            }
        });
        return d.promise;
    }

    function salva(ausencia, res) {
        delete ausencia.id;
        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.AusenciaProfissionalDAO(connection);
        var q = require('q');
        var d = q.defer();

        objDAO.salva(ausencia, function (exception, result) {
            if (exception) {
                console.log('Erro ao inserir os dados', exception);
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