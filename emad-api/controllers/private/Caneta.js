module.exports = function (app) {

    app.get('/caneta', function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let errors = [];
        let addFilter = req.query;

        if (usuario.idTipoUsuario == util.SUPER_ADMIN) {
            lista(addFilter, res).then(function (resposne) {
                res.status(200).json(resposne);
                return;
            });
        } else {
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }
    });

    app.get('/caneta/:id', function (req, res) {
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


    app.get('/caneta/caneta/:caneta/:idEstabelecimento', function (req, res) {
        let usuario = req.usuario;
        let idEstabelecimento = req.params.idEstabelecimento;
        let util = new app.util.Util();
        let errors = [];

        if (usuario.idTipoUsuario == util.SUPER_ADMIN) {
            buscarPorEstabelecimento(idEstabelecimento, res).then(function (response) {
                console.log(response);
                res.status(200).json(response);
                return;
            });
        } else {
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }
    }); 


    app.post('/caneta', function (req, res) {
        var obj = req.body;
        var usuario = req.usuario;
        var util = new app.util.Util();
        var errors = [];
        let idEstabelecimento = req.params.idEstabelecimento;

        if (usuario.idTipoUsuario == util.SUPER_ADMIN) {
            
            req.assert("modelo").notEmpty().withMessage("Modelo é um campo obrigatório");
            req.assert("serialNumber").notEmpty().withMessage("Serial number é um campo obrigatório").isLength({ min: 1, max: 15 }).withMessage("Serial number deve ter no máximo 15 caracteres");
            req.assert("situacao").notEmpty().withMessage("Situação é um campo obrigatório");
            req.assert("idEstabelecimento").notEmpty().withMessage("ID do estabelecimento é um campo obrigatório");
            
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

    app.put('/caneta', function (req, res) {
        let usuario = req.usuario;
        let obj = req.body;
        let util = new app.util.Util();
        let errors = [];
        let id = obj.id;

        if (usuario.idTipoUsuario == util.SUPER_ADMIN) {


            req.assert("modelo").notEmpty().withMessage("Modelo é um campo obrigatório");
            req.assert("serialNumber").notEmpty().withMessage("Serial number é um campo obrigatório").isLength({ min: 1, max: 15 }).withMessage("Serial number deve ter no máximo 15 caracteres");
            req.assert("situacao").notEmpty().withMessage("Situação é um campo obrigatório");
            req.assert("idEstabelecimento").notEmpty().withMessage("ID do estabelecimento é um campo obrigatório");

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

    app.delete('/caneta/:id', function (req, res) {
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

    function buscarPorEstabelecimento(estabelecimento, addFilter, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();
        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.CanetaDAO(connection);

        var errors = [];

        objDAO.listaPorEstabelecimento(estabelecimento, addFilter, function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "objs");
                res.status(500).send(errors);
                return;
            } else {
                d.resolve(result);
            }
        });
        return d.promise;
    }

    function lista(addFilter, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();
        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.CanetaDAO(connection);

        var errors = [];

        objDAO.lista(addFilter, function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "Caneta");
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
        var objDAO = new app.dao.CanetaDAO(connection);
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
        var objDAO = new app.dao.CanetaDAO(connection);
        var errors = [];

        objDAO.deletaPorId(id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                errors = util.customError(errors, "data", "Erro ao apagar os dados", "caneta");
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
        var objDAO = new app.dao.CanetaDAO(connection);
        var errors = [];

        objDAO.atualiza(obj, id, function (exception, result) {

            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao editar os dados", "caneta");
                res.status(500).send(errors);
                return;
            } else {
                d.resolve(result[0]);
            }
        });
        return d.promise;
    }

    function salva(caneta, res) {
        delete caneta.id;
        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.CanetaDAO(connection);
        var q = require('q');
        var d = q.defer();

        objDAO.salva(caneta, function (exception, result) {
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