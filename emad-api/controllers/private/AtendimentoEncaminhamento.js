module.exports = function (app) {

    const _table = "tb_atendimento_encaminhamento";

    app.post('/atendimento-encaminhamento', function (req, res) {
        let obj = req.body;
        let usuario = req.usuario;
        let util = new app.util.Util();
        let errors = [];

        req.assert("idAtendimento").notEmpty().withMessage("Atendimento é campo Obrigatório");
        req.assert("idPaciente").notEmpty().withMessage("Paciente é campo Obrigatório");
        req.assert("idEspecialidade").notEmpty().withMessage("Especialidade é um campo Obrigatório");
        req.assert("motivo").notEmpty().withMessage("Motivo é um campo Obrigatório");

        errors = req.validationErrors();

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        salvar(obj, res).then(function (response) {
            obj.id = response.insertId;
            res.status(201).send(obj);
        });
    });

    app.put('/atendimento-encaminhamento', function (req, res) {
        let obj = req.body;
        let usuario = req.usuario;
        let util = new app.util.Util();
        let errors = [];

        req.assert("idAtendimento").notEmpty().withMessage("Atendimento é campo Obrigatório");
        req.assert("idPaciente").notEmpty().withMessage("Paciente é campo Obrigatório");
        req.assert("idEspecialidade").notEmpty().withMessage("Especialidade é um campo Obrigatório");
        req.assert("motivo").notEmpty().withMessage("Motivo é um campo Obrigatório");

        errors = req.validationErrors();

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        atualizar(obj, res).then(function (response) {
            obj.id = response.insertId;
            res.status(201).send(obj);
        });
    });

    app.get('/atendimento-encaminhamento', function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let errors = [];

        lista(res).then(function (resposne) {
            res.status(200).json(resposne);
            return;
        });
    });

    app.get('/atendimento-encaminhamento/:id', function (req, res) {
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        buscarPorId(id, res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.get('/atendimento-encaminhamento/atendimento/:id', function (req, res) {
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        buscarPorAtendimentoId(id, res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.get('/atendimento-encaminhamento/usuario/:id', function (req, res) {
        let id = req.params.id;

        buscarPorEncaminhamentoUsuarioId(id, res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.delete('/atendimento-encaminhamento/:id', function (req, res) {
        let util = new app.util.Util();
        let usuario = req.usuario;
        let errors = [];
        let id = req.params.id;
        let obj = {};
        obj.id = id;

        deletaPorId(id, res).then(function (response) {
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

    function buscarPorId(id, res) {
        let q = require('q');
        let d = q.defer();
        let util = new app.util.Util();

        let connection = app.dao.ConnectionFactory();
        let objDAO = new app.dao.GenericDAO(connection, _table);
        let errors = [];

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

    function buscarPorAtendimentoId(id, res) {
        let q = require('q');
        let d = q.defer();
        let util = new app.util.Util();

        let connection = app.dao.ConnectionFactory();
        let objDAO = new app.dao.AtendimentoEncaminhamentoDAO(connection, _table);
        let errors = [];

        objDAO.buscaPorAtendimentoId(id, function (exception, result) {
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

    function buscarPorEncaminhamentoUsuarioId(id, res) {
        let q = require('q');
        let d = q.defer();
        let util = new app.util.Util();

        let connection = app.dao.ConnectionFactory();
        let objDAO = new app.dao.AtendimentoEncaminhamentoDAO(connection, _table);
        let errors = [];

        objDAO.buscaEncaminhamentoPorPacienteId(id, function (exception, result) {
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

    function salvar(obj, res) {
        delete obj.id;
        let connection = app.dao.ConnectionFactory();
        let objDAO = new app.dao.GenericDAO(connection, _table);
        let q = require('q');
        let d = q.defer();

        objDAO.salva(obj, function (exception, result) {
            if (exception) {
                console.log('Erro ao inserir', exception);
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

    function atualizar(obj, res) {
        let id = obj.id;
        delete obj.id;
        let connection = app.dao.ConnectionFactory();
        let objDAO = new app.dao.GenericDAO(connection, _table);
        let q = require('q');
        let d = q.defer();

        objDAO.atualiza(obj, id, function (exception, result) {
            if (exception) {
                console.log('Erro ao alterar o registro', exception);
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


