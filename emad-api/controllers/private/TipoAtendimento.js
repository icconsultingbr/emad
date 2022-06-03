module.exports = function (app) {

    app.get('/tipo-atendimento/tipo-ficha/:id', function (req, res) {
        let id = req.params.id;

        buscarPorId(id, res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    function buscarPorId(id, res) {
        let q = require('q');
        let d = q.defer();
        let util = new app.util.Util();

        let connection = app.dao.ConnectionFactory();
        let objDAO = new app.dao.TipoAtendimentoDAO(connection);
        let errors = [];

        objDAO.buscarPorIdTipoFicha(id, function (exception, result) {
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