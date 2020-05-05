module.exports = function (app) {

    app.get('/paciente', function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let addFilter = req.query;
        let errors = [];

        if (usuario.idTipoUsuario == util.SUPER_ADMIN) {
            lista(addFilter, res).then(function (resposne) {
                res.status(200).json(resposne);
                return;
            });
        } else {
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }
    });

    app.get('/paciente/:id', function (req, res) {
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        if (usuario.idTipoUsuario == util.SUPER_ADMIN) {
            buscarPorId(id, res).then(function (response) {
                res.status(200).json(response);
                return;
            });
        } else {
            errors = util.customError(errors, "header", "Não autorizado!", "paciente");
            res.status(401).send(errors);
        }
    });

    app.post('/paciente', function (req, res) {
        var obj = req.body;
        var usuario = req.usuario;
        var util = new app.util.Util();
        var errors = [];

        if (usuario.idTipoUsuario == util.SUPER_ADMIN) {
            req.assert("cartaoSus").notEmpty().withMessage("Cartão do SUS é um campo obrigatório;");
            req.assert("nome").notEmpty().withMessage("Nome é um campo obrigatório;");
            req.assert("nomeMae").notEmpty().withMessage("Nome da mãe é um campo obrigatório;");
            req.assert("dataNascimento").notEmpty().withMessage("Data de nascimento é um campo obrigatório;");
            req.assert("sexo").notEmpty().withMessage("Sexo é um campo obrigatório;");
            req.assert("idNacionalidade").notEmpty().withMessage("Nacionalidade é um campo obrigatório;");
            req.assert("idNaturalidade").notEmpty().withMessage("Naturalidade é um campo obrigatório;");
            req.assert("cpf").notEmpty().withMessage("CPF é um campo obrigatório;");
            req.assert("escolaridade").notEmpty().withMessage("Escolaridade é um campo obrigatório;");
            req.assert("logradouro").notEmpty().withMessage("Logradouro é um campo obrigatório;");
            req.assert("numero").notEmpty().withMessage("Número é um campo obrigatório;");
            req.assert("bairro").notEmpty().withMessage("Bairro é um campo obrigatório;");
            req.assert("idMunicipio").notEmpty().withMessage("Municipio é um campo obrigatório;");
            req.assert("situacao").notEmpty().withMessage("Situação é um campo obrigatório;");
            req.assert("idModalidade").notEmpty().withMessage("Modalidade é um campo obrigatório;");
            req.assert("idSap").isLength({ min: 0, max: 20 }).withMessage("O campo ID SAP deve ter no máximo 20 caracteres");
            
            var errors = req.validationErrors();

            if (errors) {
                res.status(400).send(errors);
                return;
            }

            obj.dataCriacao = new Date;
            if (obj.dataEmissao != null) {
                obj.dataEmissao = util.dateToISO(obj.dataEmissao);
            }
            obj.dataNascimento = util.dateToISO(obj.dataNascimento);

            salva(obj, res).then(function (response) {
                obj.id = response.insertId;
                res.status(201).send(obj);
            });

        } else {
            errors = util.customError(errors, "header", "Não autorizado!", "paciente");
            res.status(401).send(errors);
        }
    });

    app.put('/paciente', function (req, res) {
        let usuario = req.usuario;
        let obj = req.body;
        let util = new app.util.Util();
        let errors = [];
        let id = obj.id;
        delete obj.id;

        if (usuario.idTipoUsuario == util.SUPER_ADMIN) {
            req.assert("cartaoSus").notEmpty().withMessage("Cartão do SUS é um campo obrigatório;");
            req.assert("nome").notEmpty().withMessage("Nome é um campo obrigatório;");
            req.assert("nomeMae").notEmpty().withMessage("Nome da mãe é um campo obrigatório;");
            req.assert("dataNascimento").notEmpty().withMessage("Data de nascimento é um campo obrigatório;");
            req.assert("sexo").notEmpty().withMessage("Sexo é um campo obrigatório;");
            req.assert("idNacionalidade").notEmpty().withMessage("Nacionalidade é um campo obrigatório;");
            req.assert("idNaturalidade").notEmpty().withMessage("Naturalidade é um campo obrigatório;");
            req.assert("cpf").notEmpty().withMessage("CPF é um campo obrigatório;");
            req.assert("escolaridade").notEmpty().withMessage("Escolaridade é um campo obrigatório;");
            req.assert("logradouro").notEmpty().withMessage("Logradouro é um campo obrigatório;");
            req.assert("numero").notEmpty().withMessage("Número é um campo obrigatório;");
            req.assert("bairro").notEmpty().withMessage("Bairro é um campo obrigatório;");
            req.assert("idMunicipio").notEmpty().withMessage("Municipio é um campo obrigatório;");
            req.assert("situacao").notEmpty().withMessage("Situação é um campo obrigatório;");
            req.assert("idModalidade").notEmpty().withMessage("Modalidade é um campo obrigatório;");
            req.assert("idSap").isLength({ min: 0, max: 20 }).withMessage("O campo ID SAP deve ter no máximo 20 caracteres");
            
            
            errors = req.validationErrors();
            
            if (errors) {
                res.status(400).send(errors);
                return;
            }
            
            if (obj.dataEmissao != null) {
                obj.dataEmissao = util.dateToISO(obj.dataEmissao);
            }
            obj.dataNascimento = util.dateToISO(obj.dataNascimento);

            buscarPorId(id, res).then(function (response) {
                if (typeof response != 'undefined') {
                    atualizaPorId(obj, id, res).then(function (response2) {
                        res.status(200).json(obj);
                        return;
                    });
                } else {
                    errors = util.customError(errors, "body", "Paciente não encontrado!", obj.nome);
                    res.status(404).send(errors);
                    return;
                }
            });

        } else {
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }
    });

    app.delete('/paciente/:id', function (req, res) {
        var util = new app.util.Util();
        let usuario = req.usuario;
        let errors = [];
        let id = req.params.id;
        let obj = {};
        obj.id = id;

        if (usuario.idTipoUsuario == util.SUPER_ADMIN) {
            deletaPorId(id, res).then(function (response) {
                res.status(200).json(obj);
                return;
            });

        } else {
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }
    });

    app.get('/paciente/estabelecimentos/:id/:raio/:idTipoUnidade', function (req, res) {
        let usuario = req.usuario;
        let id = req.params.id;
        let raio = req.params.raio;
        let idTipoUnidade = req.params.idTipoUnidade;
        let util = new app.util.Util();
        let errors = [];

        if (usuario.idTipoUsuario == util.SUPER_ADMIN) {
            buscarEstabelecimentos(id, raio, idTipoUnidade, res).then(function (response) {
                res.status(200).json(response);
                return;
            });
        } else {
            errors = util.customError(errors, "header", "Não autorizado!", "paciente");
            res.status(401).send(errors);
        }
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
                errors = util.customError(errors, "data", "Erro ao apagar os dados", "paciente");
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
        var connectionDim = app.dao.ConnectionFactoryDim();
        var objDAO = new app.dao.PacienteDAO(connection, connectionDim);
        var errors = [];

        objDAO.atualiza(obj, id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao editar os dados", "paciente");
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
        var connectionDim = app.dao.ConnectionFactoryDim();
        var objDAO = new app.dao.PacienteDAO(connection, connectionDim);
        var q = require('q');
        var d = q.defer();

        objDAO.salva(paciente, function (exception, result) {
            if (exception) {
                console.log('Erro ao inserir Tipo de servico', exception);
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