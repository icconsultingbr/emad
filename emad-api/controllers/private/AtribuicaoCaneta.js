module.exports = function (app) {

    const _table = "tb_atribuicao_caneta";

    app.get('/atribuicao-caneta', function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let errors = [];
        let addFilter = req.query;

        let idEstabelecimento = req.headers.est;

        if(idEstabelecimento)
            addFilter.idEstabelecimento = idEstabelecimento;    

            lista(addFilter, res).then(function (resposne) {
                res.status(200).json(resposne);
                return;
            });
    });

    app.get('/atribuicao-caneta/:id', function (req, res) {
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        buscarPorId(id, res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.post('/atribuicao-caneta', function (req, res) {
        var obj = req.body;
        var usuario = req.usuario;
        var util = new app.util.Util();
        var errors = [];
        let idEstabelecimento = req.params.idEstabelecimento;
           
            req.assert("idCaneta").notEmpty().withMessage("Caneta é um campo obrigatório");
            req.assert("idProfissional").notEmpty().withMessage("Profissional é um campo obrigatório");
            req.assert("periodoInicial").notEmpty().withMessage("Data/hora de atribuição inicial é um campo obrigatório");
            req.assert("periodoFinal").notEmpty().withMessage("Data/hora de atribuição final é um campo obrigatório");
            
            var errors = req.validationErrors();

            if (errors) {
                res.status(400).send(errors);
                return;
            }

            obj.dataCriacao = new Date;

            salva(obj, res).then(function(response) {
                obj.id = response.insertId;
                res.status(201).send(obj);
            });  
    });

    app.put('/atribuicao-caneta', function (req, res) {
        let usuario = req.usuario;
        let obj = req.body;
        let util = new app.util.Util();
        let errors = [];
        let id = obj.id;
        let idEstabelecimento = req.params.idEstabelecimento;

            req.assert("idCaneta").isNumeric().notEmpty().withMessage("Caneta é um campo obrigatório");
            req.assert("idProfissional").notEmpty().withMessage("Profissional é um campo obrigatório");
            req.assert("periodoInicial").notEmpty().withMessage("Data/hora de atribuição inicial é um campo obrigatório");
            req.assert("periodoFinal").notEmpty().withMessage("Data/hora de atribuição final é um campo obrigatório");

            errors = req.validationErrors();

            if (errors) {
                res.status(400).send(errors);
                return;
            }
            atualizaPorId(obj, id, res).then(function(response) {
                id = id;
                res.status(201).send(obj);
            });
    });

    app.delete('/atribuicao-caneta/:id', function (req, res) {
        var util = new app.util.Util();
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

    app.get('/atribuicao-caneta/profissional/:idProfissional', function(req,res){        
        let usuario = req.usuario;
        let id = req.params.id;
        let idProfissional = req.params.idProfissional;
        let dataInicial = req.query.dataInicial;
        let horaInicial = req.query.horaInicial;
        let dataFinal = req.query.dataFinal;
        let horaFinal = req.query.horaFinal;

        let util = new app.util.Util();
        let errors = [];

        buscarAtribuicaoPorProfissionalId(idProfissional, dataInicial, horaInicial , dataFinal, horaFinal, res).then(function(response) {
            res.status(200).json(response);
            return;      
        });
    }); 

    function buscarAtribuicaoPorProfissionalId(id, dataInicial, horaInicial , dataFinal, horaFinal, res) {
        let q = require('q');
        let d = q.defer();
        let util = new app.util.Util();
       
        let connection = app.dao.ConnectionFactory();
        let objDAO = new app.dao.AtribuicaoCanetaDAO(connection, _table);
        let errors =[];
     
        objDAO.buscaPorProfissionalId(id, dataInicial, horaInicial , dataFinal, horaFinal,  function(exception, result){
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

    function lista(addFilter, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();
        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.AtribuicaoCanetaDAO(connection);

        var errors = [];

        objDAO.lista(addFilter, function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "Atribuição da caneta");
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
        var objDAO = new app.dao.AtribuicaoCanetaDAO(connection);
        var errors = [];

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

    function deletaPorId(id, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.AtribuicaoCanetaDAO(connection);
        var errors = [];

        objDAO.deletaPorId(id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                errors = util.customError(errors, "data", "Erro ao remover os dados", "Atribuição da caneta");
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
        var objDAO = new app.dao.AtribuicaoCanetaDAO(connection);
        var errors = [];

        objDAO.atualiza(obj, id, function (exception, result) {

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

    function salva(caneta, res) {
        delete caneta.id;
        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.AtribuicaoCanetaDAO(connection);
        var q = require('q');
        var d = q.defer();

        objDAO.salva(caneta, function (exception, result) {
            if (exception) {
                console.log('Erro ao inserir os dados', exception);
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
}