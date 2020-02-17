module.exports = function (app) {

    app.get('/log', function (req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.LogDAO(connection);
        var usuario = req.usuario;
        let addFilter = req.query;
        let errors = [];
        var util = new app.util.Util();    
        

        if (usuario.idTipoUsuario == util.SUPER_ADMIN) {
            lista(addFilter,usuario, dao, "uf", res).then(function (response) {
                res.status(200).json(response);
                return;
            });
        } else {
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }
    });


    function lista(addFilter,usuario, dao, dom, res) {
        var q = require('q');
        var d = q.defer();
        
        var util = new app.util.Util();      
        var errors = [];


        dao.lista(addFilter,usuario, function (exception, result) {
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
    }


}


