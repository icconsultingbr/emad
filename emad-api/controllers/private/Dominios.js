module.exports = function (app) {

    app.get('/dominios/uf', function (req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.UfDAO(connection);

        listaDominios(dao, "uf", res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });


    app.get('/dominios/especialidade', function (req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.EspecialidadeDAO(connection);

        listaDominios(dao, "especialidade", res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });


    app.get('/dominios/tipo-unidade', function (req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.TipoUnidadeDAO(connection);

        listaDominios(dao, "tipo-unidade", res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.get('/dominios/nacionalidade', function (req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.NacionalidadeDAO(connection);

        listaDominios(dao, "nacionalidade", res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.get('/dominios/estabelecimento', function (req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.EstabelecimentoDAO(connection);
        

        listaDominios(dao, "estabelecimento", res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.get('/dominios/modalidade', function (req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.ModalidadeDAO(connection);
        
        listaDominios(dao, "modalidade", res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.get('/dominios/equipe', function (req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.EquipeDAO(connection);
        
        listaDominios(dao, "Equipe EMAD", res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.get('/dominios/hipotese-diagnostica', function (req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.HipoteseDiagnosticaDAO(connection);
        
        listaDominios(dao, "Hipótese diagnóstica", res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.get('/dominios/medicamento', function (req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.MedicamentoDAO(connection);
        
        listaDominios(dao, "Medicamentos", res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.get('/dominios/profissional', function (req, res) {

        var connection = app.dao.ConnectionFactory();
        var dao = new app.dao.ProfissionalDAO(connection);
        
        listaDominios(dao, "Profissional", res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });


    function listaDominios(dao, dom, res) {
        var q = require('q');
        var d = q.defer();
        
        var util = new app.util.Util();      
        var errors = [];

        dao.dominio(function (exception, result) {
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


