module.exports = function (app) {

    app.get('/paciente', function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let addFilter = req.query;
        let errors = [];

        lista(addFilter, res).then(function (resposne) {
            res.status(200).json(resposne);
            return;
        });
    });

    app.get('/paciente/:id', async function (req, res) {
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        const connection = await app.dao.connections.EatendConnection.connection();

        const pacienteRepository = new app.dao.PacienteDAO(connection, null);
        const atencaoContinuadaPacienteRepository = new app.dao.AtencaoContinuadaPacienteDAO(connection);

            try {
                var response = await pacienteRepository.buscaPorIdSync(id);
                
                var gruposAtencaoContinuada  = await atencaoContinuadaPacienteRepository.buscaPorPacienteSync(id);
                response[0].gruposAtencaoContinuada = gruposAtencaoContinuada;

                res.status(201).send(response[0]);
            }
            catch (exception) {
                res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));
            }
            finally {
                await connection.close();
            }

    });

    app.post('/paciente', async function (req, res) {
        var obj = req.body;
        var usuario = req.usuario;
        var util = new app.util.Util();
        var errors = [];
        let gruposAtencaoContinuada = obj.gruposAtencaoContinuada;
        let arrAtencaoContinuada = [];        

            req.assert("nome").notEmpty().withMessage("Nome é um campo obrigatório;");
            req.assert("nomeMae").notEmpty().withMessage("Nome da mãe é um campo obrigatório;");
            req.assert("dataNascimento").notEmpty().withMessage("Data de nascimento é um campo obrigatório;");
            req.assert("sexo").notEmpty().withMessage("Sexo é um campo obrigatório;");
            req.assert("idNacionalidade").notEmpty().withMessage("Nacionalidade é um campo obrigatório;");
            req.assert("idNaturalidade").notEmpty().withMessage("Naturalidade é um campo obrigatório;");
            req.assert("escolaridade").notEmpty().withMessage("Escolaridade é um campo obrigatório;");
            req.assert("situacao").notEmpty().withMessage("Situação é um campo obrigatório;");            
            req.assert("idSap").isLength({ min: 0, max: 20 }).withMessage("O campo ID SAP deve ter no máximo 20 caracteres");
            req.assert("cartaoSus").isLength({ min: 0, max: 15 }).withMessage("O campo Cartão SUS deve ter no máximo 15 caracteres");
            req.assert("numeroProntuario").isLength({ min: 0, max: 20 }).withMessage("O campo Número prontuário deve ter no máximo 20 caracteres");
            req.assert("numeroProntuarioCnes").isLength({ min: 0, max: 20 }).withMessage("O campo Número prontuário Cnes deve ter no máximo 20 caracteres");
            
            var errors = req.validationErrors();

            if (errors) {
                res.status(400).send(errors);
                return;
            }

            delete obj.gruposAtencaoContinuada;

            obj.dataCriacao = new Date;
            if (obj.dataEmissao != null) {
                obj.dataEmissao = util.dateToISO(obj.dataEmissao);
            }
            obj.dataNascimento = util.dateToISO(obj.dataNascimento);

            const connection = await app.dao.connections.EatendConnection.connection();

            const pacienteRepository = new app.dao.PacienteDAO(connection, null);
            const atencaoContinuadaPacienteRepository = new app.dao.AtencaoContinuadaPacienteDAO(connection);

            
            try {
                await connection.beginTransaction();
                
                var response = await pacienteRepository.salvaAsync(obj);
                obj.id = response[0].insertId;

                if(gruposAtencaoContinuada){
                    for (const item of gruposAtencaoContinuada) {
                        arrAtencaoContinuada.push("(" + obj.id + ", " + item.id + ")");   
                    }
                }

                if(arrAtencaoContinuada.length > 0)
                    var atualizaResult  = await atencaoContinuadaPacienteRepository.atualizaGrupoPorPacienteSync(arrAtencaoContinuada);

                res.status(201).send(obj);
                await connection.commit();
            }
            catch (exception) {
                res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));
                await connection.rollback();
            }
            finally {
                await connection.close();
            }
    });

    app.put('/paciente', async function (req, res) {
        let usuario = req.usuario;
        let obj = req.body;
        let util = new app.util.Util();
        let errors = [];
        let id = obj.id;
        delete obj.id;
        let gruposAtencaoContinuada = obj.gruposAtencaoContinuada;
        let arrAtencaoContinuada = [];        

        //req.assert("cartaoSus").notEmpty().withMessage("Cartão do SUS é um campo obrigatório;");
            req.assert("nome").notEmpty().withMessage("Nome é um campo obrigatório;");
            req.assert("nomeMae").notEmpty().withMessage("Nome da mãe é um campo obrigatório;");
            req.assert("dataNascimento").notEmpty().withMessage("Data de nascimento é um campo obrigatório;");
            req.assert("sexo").notEmpty().withMessage("Sexo é um campo obrigatório;");
            req.assert("idNacionalidade").notEmpty().withMessage("Nacionalidade é um campo obrigatório;");
            req.assert("idNaturalidade").notEmpty().withMessage("Naturalidade é um campo obrigatório;");
            //req.assert("cpf").notEmpty().withMessage("CPF é um campo obrigatório;");
            req.assert("escolaridade").notEmpty().withMessage("Escolaridade é um campo obrigatório;");
            //req.assert("logradouro").notEmpty().withMessage("Logradouro é um campo obrigatório;");
            //req.assert("numero").notEmpty().withMessage("Número é um campo obrigatório;");
            //req.assert("bairro").notEmpty().withMessage("Bairro é um campo obrigatório;");
            //req.assert("idMunicipio").notEmpty().withMessage("Municipio é um campo obrigatório;");
            req.assert("situacao").notEmpty().withMessage("Situação é um campo obrigatório;");            
            req.assert("idSap").isLength({ min: 0, max: 20 }).withMessage("O campo ID SAP deve ter no máximo 20 caracteres");
            req.assert("cartaoSus").isLength({ min: 0, max: 15 }).withMessage("O campo Cartão SUS deve ter no máximo 15 caracteres");
            req.assert("numeroProntuario").isLength({ min: 0, max: 20 }).withMessage("O campo Número prontuário deve ter no máximo 20 caracteres");
            req.assert("numeroProntuarioCnes").isLength({ min: 0, max: 20 }).withMessage("O campo Número prontuário Cnes deve ter no máximo 20 caracteres");

            errors = req.validationErrors();
            
            if (errors) {
                res.status(400).send(errors);
                return;
            }

            delete obj.gruposAtencaoContinuada;
            
            if (obj.dataEmissao != null) {
                obj.dataEmissao = util.dateToISO(obj.dataEmissao);
            }
            obj.dataNascimento = util.dateToISO(obj.dataNascimento);

            const connection = await app.dao.connections.EatendConnection.connection();

            const pacienteRepository = new app.dao.PacienteDAO(connection);
            const atencaoContinuadaPacienteRepository = new app.dao.AtencaoContinuadaPacienteDAO(connection);

            try {
                await connection.beginTransaction();                        
                var response = await pacienteRepository.atualizaAsync(obj, id);

                var deleteResult  = await atencaoContinuadaPacienteRepository.deletaGrupoPorPacienteSync(id);

                if(gruposAtencaoContinuada){
                    for (const item of gruposAtencaoContinuada) {
                        arrAtencaoContinuada.push("(" + id + ", " + item.id + ")");   
                    }
                }

                if(arrAtencaoContinuada.length > 0)
                    var atualizaResult  = await atencaoContinuadaPacienteRepository.atualizaGrupoPorPacienteSync(arrAtencaoContinuada);

                res.status(201).send(obj);
                await connection.commit();
            }
            catch (exception) {
                res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));
                await connection.rollback();
            }
            finally {
                await connection.close();
            }
    });

    app.delete('/paciente/:id', function (req, res) {
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

    app.get('/paciente/estabelecimentos/:id/:raio/:idTipoUnidade', function (req, res) {
        let usuario = req.usuario;
        let id = req.params.id;
        let raio = req.params.raio;
        let idTipoUnidade = req.params.idTipoUnidade;
        let util = new app.util.Util();
        let errors = [];

        buscarEstabelecimentos(id, raio, idTipoUnidade, res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    function lista(addFilter, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();
        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.PacienteDAO(connection, null);

        var errors = [];

        objDAO.lista(addFilter, function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "objs");
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
        var objDAO = new app.dao.PacienteDAO(connection, null);
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
        var connectionDim = app.dao.ConnectionFactoryDim();
        var objDAO = new app.dao.PacienteDAO(connection, connectionDim);
        var errors = [];

        objDAO.deletaPorId(id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                errors = util.customError(errors, "data", "Erro ao remover os dados", "paciente");
                res.status(500).send(errors);
                return;
            } else {

                d.resolve(result[0]);
            }
        });
        return d.promise;
    }

    function buscarEstabelecimentos(id, raio, idTipoUnidade, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.PacienteDAO(connection);
        var errors = [];

        objDAO.buscarEstabelecimentos(id, raio, idTipoUnidade, function (exception, result) {
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