module.exports = function (app) {

    app.get('/uf', function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let errors = [];

        lista(res).then(function (resposne) {
            res.status(200).json(resposne);
            return;
        });
    });

    app.get('/uf/dominios', function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let errors = [];

        listaDominios(res).then(function (resposne) {
            res.status(200).json(resposne);
            return;
        });
    });

    app.get('/uf/:id', function (req, res) {
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        buscarPorId(id, res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.get('/uf/pais/:id', function (req, res) {
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        buscarPorPais(id, res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });


    function lista(res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();
        var connection = app.dao.ConnectionFactory();
        var ufDAO = new app.dao.UfDAO(connection);

        var errors = [];

        ufDAO.lista(function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "ufs");
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
        var ufDAO = new app.dao.UfDAO(connection);
        var errors = [];

        ufDAO.buscaPorId(id, function (exception, result) {
            if (exception) {
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "uf");
                res.status(500).send(errors);
                return;
            } else {

                d.resolve(result[0]);
            }
        });
        return d.promise;
    }

    function buscarPorPais(idPais, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var ufDAO = new app.dao.UfDAO(connection);
        var errors = [];

        ufDAO.buscaPorPais(idPais, function (exception, result) {
            if (exception) {
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "uf");
                res.status(500).send(errors);
                return;
            } else {

                d.resolve(result);
            }
        });
        return d.promise;
    }

    function listaDominios(res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();
        var connection = app.dao.ConnectionFactory();
        var ufDAO = new app.dao.UfDAO(connection);

        var errors = [];

        ufDAO.listaDominios(function (exception, result) {
            if (exception) {
                d.reject(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "ufs");
                res.status(500).send(errors);
                return;
            } else {
                d.resolve(result);
            }
        });
        return d.promise;
    }


}


