module.exports = function (app) {



    /*app.get('/load-data/:id', function (req, res) {

        const id = req.params.id;
        const fs = require('fs');
        const util = new app.util.Util();

        let rawdata = fs.readFileSync(`data/data-${id}.json`);
        let pacientes = JSON.parse(rawdata);
        let forEachAsync = require('forEachAsync').forEachAsync;
        let arr = [];



        forEachAsync(pacientes, function (next, paciente, index, array) {

            let obj = {};


            obj.cartaoSus = '0000000' + (Math.floor(Math.random() * 256));
            obj.nome = paciente.nome;
            obj.nomeMae = 'Mãe';
            obj.dataNascimento = util.dateToISO(paciente.data_nasc);
            obj.idNacionalidade = 1;
            obj.idNaturalidade = 6;
            obj.idUf = 6;
            obj.cpf = paciente.cpf;
            obj.escolaridade = 4;
            obj.logradouro = paciente.endereco;
            obj.numero = paciente.numero;
            obj.bairro = paciente.bairro;
            obj.idMunicipio = 950;
            obj.situacao = 1;
            obj.idModalidade = 1;
            obj.latitude = '-3.74952270';
            obj.longitude = '-38.57060710';
            obj.sexo = 'F';
            obj.cep = '03673-000';

            arr.push(obj);

            salva(obj, res);

            next();

        }).then(function () {
            console.log(arr);
            res.status(200).json(arr);
        });

        
    });*/

    app.post('/endereco/buscarCEP', function (req, res) {

        //var cep = req.params.cep;
        var cep = req.body.cep;
        var util = new app.util.Util();

        req.assert("cep").notEmpty().withMessage("CEP é obrigatório").isLength({ min: 8, max: 8 }).withMessage("CEP deve ter 8 dígitos!");
        var errors = req.validationErrors();

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        var clienteCEP = new app.services.ClientCEP();
        clienteCEP.consultaCep(cep, function (data, response) {
            if (response.statusCode != 200) {
                errors = util.customError(response.statusCode, "CEP", "CEP não encontrado", cep);
                res.status(404).json(errors);
            }
            res.status(200).json(data);
        });
    });


    app.get('/endereco/cep/:cep', function (req, res) {


        req.params.cep = req.params.cep.replace(/[.-]/g, '');
        let cep = req.params.cep;
        let util = new app.util.Util();


        req.assert("cep").notEmpty().withMessage("CEP é obrigatório").isLength({ min: 8, max: 8 }).withMessage("CEP deve ter 8 dígitos!");
        var errors = req.validationErrors();

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        var clienteCEP = new app.services.ClientCEP();

        clienteCEP.consultaCep(cep, function (data, response) {

            if (response.statusCode != 200) {
                errors = util.customError(response.statusCode, "CEP", "CEP não encontrado", cep);
                res.status(404).json(errors);
            } else {

                buscarPorUf(data.uf, res).then(function (resUf) {
                    console.log(data.localidade);
                    buscarPorMunicipio(data.localidade, res).then(function (resMun) {

                        let obj = {};

                        let uf = resUf
                        let municipio = resMun;


                        obj.idUf = uf.id;
                        obj.logradouro = data.logradouro;
                        obj.bairro = data.bairro;
                        obj.idMunicipio = municipio.id;

                        res.status(200).json(obj);

                    });
                });

            }
        });
    });


    function buscarPorUf(uf, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var ufDAO = new app.dao.UfDAO(connection);
        var errors = [];

        ufDAO.buscarPorUf(uf, function (exception, result) {

            if (exception) {
                d.reject(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "UF");
                res.status(500).send(errors);
                return;
            } else {
                d.resolve(result[0]);
            }
        });
        return d.promise;
    }

    function buscarPorMunicipio(municipio, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var municipioDAO = new app.dao.MunicipioDAO(connection);
        var errors = [];

        municipioDAO.buscarPorMunicipio(municipio, function (exception, result) {
            if (exception) {
                d.reject(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "Municipio");
                res.status(500).send(errors);
                return;
            } else {

                d.resolve(result[0]);
            }
        });
        return d.promise;
    }

    function salva(paciente, res) {
        delete paciente.id;
        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.PacienteDAO(connection);
        var q = require('q');
        var d = q.defer();

        objDAO.salva(paciente, function (exception, result) {
            if (exception) {
                console.log('Erro ao inserir Paciente', exception);
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


