module.exports = function (app) {

    const _table = "tb_atividade_coletiva_profissionais";

    app.post('/profissional-atividade-coletiva', function (req, res) {
        let obj = req.body;

        delete obj.nomePaciente;
        delete obj.sexo;
        delete obj.cartaoSus;
        delete obj.dataNascimento;

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

    app.get('/profissional-atividade-coletiva/atendimento/:id', function (req, res) {
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        buscarPorAtendimentoId(id, res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.delete('/profissional-atividade-coletiva/:id', function (req, res) {
        let id = req.params.id;
        let obj = {};
        obj.id = id;

        deletaPorId(id, res).then(function (response) {
            res.status(200).json(obj);
            return;
        });
    });

    function buscarPorAtendimentoId(id, res) {
        let q = require('q');
        let d = q.defer();
        let util = new app.util.Util();

        let connection = app.dao.ConnectionFactory();
        let objDAO = new app.dao.AtendimentoProfissionalAtividadeColetivaDAO(connection, _table);
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
        let objDAO = new app.dao.AtendimentoProfissionalAtividadeColetivaDAO(connection, _table);
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

