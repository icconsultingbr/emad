module.exports = function (app) {

    const _table = "tb_tipo_vigilancia_odonto_atendimento";

    app.post('/tipo-vigilancia-odonto', function (req, res) {
        let obj = req.body;

        delete obj.nome;

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

    app.get('/tipo-vigilancia-odonto/:id', function (req, res) {
        let id = req.params.id;

        buscarPorAtendimentoId(id, res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.delete('/tipo-vigilancia-odonto/:id', function (req, res) {
        let id = req.params.id;
        let obj = {};
        obj.id = id;

        deletaPorId(id, res).then(function (response) {
            res.status(200).json(obj);
            return;
        });
    });

    app.put('/tipo-vigilancia-odonto', function (req, res) {
        let obj = req.body;
        let errors = [];
        let id = obj.id;

        errors = req.validationErrors();

        delete obj.nomePaciente;
        delete obj.sexo;
        delete obj.cartaoSus;
        delete obj.dataNascimento;

        if (errors) {
            res.status(400).send(errors);
            return;
        }
        atualizaPorId(obj, id, res).then(function (response) {
            id = id;
            res.status(201).send(obj);
        });
    });

    function buscarPorAtendimentoId(id, res) {
        let q = require('q');
        let d = q.defer();
        let util = new app.util.Util();

        let connection = app.dao.ConnectionFactory();
        let objDAO = new app.dao.AtendimentoTipoVigilanciaOdontoDAO(connection, _table);
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

    function deletaPorId(id, res) {
        let q = require('q');
        let d = q.defer();
        let util = new app.util.Util();
        let connection = app.dao.ConnectionFactory();
        let objDAO = new app.dao.AtendimentoTipoVigilanciaOdontoDAO(connection, _table);
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

    function atualizaPorId(obj, id, res) {

        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.AtendimentoTipoVigilanciaOdontoDAO(connection);
        var errors = [];

        objDAO.atualizaPorId(obj, id, function (exception, result) {

            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao editar os dados", "Atribuição da caneta");
                res.status(500).send(errors);
                return;
            } else {
                d.resolve(result[0]);
            }
        });
        return d.promise;
    }
}

