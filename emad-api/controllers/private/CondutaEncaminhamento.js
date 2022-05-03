module.exports = function (app) {

    const _table = "tb_classificacao_risco";

    app.get('/conduta-encaminhamento/:id', function (req, res) {
        let id = req.params.id;

        buscarPorId(id, res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    function lista(res) {
        let q = require('q');
        let d = q.defer();
        let util = new app.util.Util();
        let connection = app.dao.ConnectionFactory();
        let objDAO = new app.dao.CondutaEncaminhamentoDAO(connection, _table);

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
        let objDAO = new app.dao.CondutaEncaminhamentoDAO(connection, _table);
        let errors = [];

        objDAO.lista(id, function (exception, result) {
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