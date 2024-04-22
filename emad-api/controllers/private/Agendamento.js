module.exports = function (app) {

    app.get('/agendamento', function (req, res) {
        listaAgendamento(req.query, "agendamento", res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.get('/agendamento/:id', function (req, res) {
        let usuario = req.usuario;
        let id = parseInt(req.params.id);
        let util = new app.util.Util();
        let errors = [];

        buscarPorId(id, res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.get('/agendamento/profissional/:id', function (req, res) {
        let usuario = req.usuario;
        let id = parseInt(req.params.id);
        let util = new app.util.Util();
        let errors = [];

        buscaPorProfissional(id, res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.get('/agendamento/equipe/:id', function (req, res) {
        let usuario = req.usuario;
        let id = parseInt(req.params.id);
        let util = new app.util.Util();
        let errors = [];

        buscaPorEquipe(id, res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.get('/agendamento/paciente/:id', function (req, res) {
        let usuario = req.usuario;
        let id = parseInt(req.params.id);
        let util = new app.util.Util();
        let errors = [];

        buscaPorPaciente(id, res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.get('/agendamento/forma-atendimento/agendamento', function (req, res) {
        formaAtendiemnto(req, res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.get('/agendamento/tipo-atendimento/agendamento', function (req, res) {
        tipoAtendiemnto(req, res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.post('/agendamento', function (req, res) {
        var obj = req.body;
        var usuario = req.usuario;
        var util = new app.util.Util();
        var errors = [];
        var json = {};

        json.idPaciente = Number(obj.idPaciente);
        json.idEquipe = obj.idEquipe ? Number(obj.idEquipe) : null;
        json.idProfissional = obj.idProfissional ? Number(obj.idProfissional) : null;
        json.formaAtendimento = Number(obj.formaAtendimento);
        json.tipoAtendimento = Number(obj.tipoAtendimento);
        json.dataInicial = obj.dataInicial;
        json.dataFinal = obj.dataFinal;
        json.observacao = obj.observacao
        json.situacao = 1;

        salvar(json, res).then(function (response) {
            json.id = response.insertId;
            res.status(201).send(json);
        });
    });

    app.put('/agendamento', function (req, res) {
        var obj = req.body;
        var usuario = req.usuario;
        var util = new app.util.Util();
        var errors = [];
        var json = {};

        json.id = obj.id
        json.idPaciente = obj.idPaciente;
        json.idEquipe = obj.idEquipe;
        json.idProfissional = obj.idProfissional;
        json.formaAtendimento = obj.formaAtendimento;
        json.tipoAtendimento = obj.tipoAtendimento;
        json.dataInicial = obj.dataInicial;
        json.dataFinal = obj.dataFinal;
        json.observacao = obj.observacao
        json.situacao = 1;

        editar(json, res).then(function (response) {
            res.status(201).send(response);
        });
    });

    app.delete('/agendamento/:id', function (req, res) {
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

    function formaAtendiemnto(obj, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();
        var errors = [];

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.AgendamentoDAO(connection);
        dao.formaAtendimento(function (exception, result) {
            if (exception) {
                console.log(exception);
                d.reject(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", dom);
                res.status(500).send(errors);
                return;
            } else {
                d.resolve(result);
            }
        });
        return d.promise;
    }

    function tipoAtendiemnto(obj, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();
        var errors = [];

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.AgendamentoDAO(connection);
        dao.tipoAtendimento(function (exception, result) {
            if (exception) {
                console.log(exception);
                d.reject(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", dom);
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
        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.AgendamentoDAO(connection);
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
    };

    function editar(obj, res) {
        let id = obj.id;
        delete obj.id;
        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.AgendamentoDAO(connection);
        let q = require('q');
        let d = q.defer();


        objDAO.atualiza(obj, id, function (exception, result) {
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
    };

    function listaAgendamento(addFilter, dom, res) {
        var q = require('q');
        var d = q.defer();

        var util = new app.util.Util();
        var errors = [];

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.AgendamentoDAO(connection);

        dao.lista(addFilter, function (exception, result) {
            if (exception) {
                d.reject(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", dom);
                res.status(500).send(errors);
                return;
            } else {
                d.resolve(result);
            }
        });

        return d.promise;
    };

    function buscarPorId(id, res) {
        let q = require('q');
        let d = q.defer();
        let util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.AgendamentoDAO(connection);
        let errors = [];

        objDAO.buscaPorId(id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "obj");
                res.status(500).send(errors);
                return;
            }

            d.resolve(result[0]);
        });
        return d.promise;
    };

    function buscaPorEquipe(id, res) {
        let q = require('q');
        let d = q.defer();
        let util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.AgendamentoDAO(connection);
        let errors = [];

        objDAO.buscaPorEquipe(id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "obj");
                res.status(500).send(errors);
                return;
            } else {

                d.resolve(result);
            }
        });
        return d.promise;
    };

    function buscaPorProfissional(id, res) {
        let q = require('q');
        let d = q.defer();
        let util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.AgendamentoDAO(connection);
        let errors = [];

        objDAO.buscaPorProfissional(id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "obj");
                res.status(500).send(errors);
                return;
            } else {

                d.resolve(result);
            }
        });
        return d.promise;
    };

    function buscaPorPaciente(id, res) {
        let q = require('q');
        let d = q.defer();
        let util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.AgendamentoDAO(connection);
        let errors = [];

        objDAO.buscaPorPaciente(id, function (exception, result) {
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
    };

    function deletaPorId(id, res) {
        let q = require('q');
        let d = q.defer();
        let util = new app.util.Util();
        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.AgendamentoDAO(connection);
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
    };
}


