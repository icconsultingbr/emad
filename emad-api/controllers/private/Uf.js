module.exports = function (app) {

    app.get('/uf', function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let errors = [];

        if (usuario.idTipoUsuario == util.SUPER_ADMIN) {
            lista(res).then(function (resposne) {
                res.status(200).json(resposne);
                return;
            });
        }
        else {
            errors = util.customError(errors, "header", "Não autorizado1!", "acesso");
            res.status(401).send(errors);
        }
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

        if (usuario.idTipoUsuario == util.SUPER_ADMIN) {
            buscarPorId(id, res).then(function (response) {
                res.status(200).json(response);
                return;
            });
        }
        else {
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }
    });

    app.get('/uf/pais/:id', function (req, res) {
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        if (usuario.idTipoUsuario == util.SUPER_ADMIN) {
            buscarPorPais(id, res).then(function (response) {
                res.status(200).json(response);
                return;
            });
        }
        else {
            errors = util.customError(errors, "header", "Não autorizado!", "UF");
            res.status(401).send(errors);
        }
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


