module.exports = function (app) {


    app.get('/atendimento', function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let addFilter = req.query;
        let errors = [];

        if (usuario.idTipoUsuario == util.SUPER_ADMIN) {
            lista(addFilter, res).then(function (resposne) {
                res.status(200).json(resposne);
                return;
            });
        }
        else {
            listaPorUsuario(usuario, addFilter, res).then(function (resposne) {
                res.status(200).json(resposne);
                return;
            });
        }
    });

    app.post('/atendimento/print-document', function (req, res) {
        let usuario = req.usuario;

        console.log('teste')
        res.status(200).json({ id: 1 });

    });

    app.post('/atendimento/open-document', function (req, res) {
        let object = {};
        object.msg = 'success';
        res.status(200).json(object);
        return;

    });

    app.get('/atendimento/:id', function (req, res) {
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

    app.get('/atendimento/paciente/:id/:idEstabelecimento', function (req, res) {
        let usuario = req.usuario;
        let id = req.params.id;
        let idEstabelecimento = req.params.idEstabelecimento;
        let util = new app.util.Util();
        let errors = [];

        if (usuario.idTipoUsuario == util.SUPER_ADMIN) {
            buscaPorPacienteId(id, usuario, idEstabelecimento, res).then(function (response) {
                res.status(200).json(response);
                return;
            });
        }
        else {
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }
    });

    app.post('/atendimento', function (req, res) {
        var obj = req.body;
        var usuario = req.usuario;
        var util = new app.util.Util();
        delete obj.pacienteNome;
        obj.idUsuario = usuario.id;
        var errors = [];
        let idEstabelecimento = req.headers.est;
        let mail = new app.util.Mail();

        if (usuario.idTipoUsuario == util.SUPER_ADMIN) {

            req.assert("idPaciente").notEmpty().withMessage("Paciente um campo obrigatório;");
            /*req.assert("pressaoArterial").notEmpty().withMessage("Pressão arterial é um campo obrigatório;");
            req.assert("pulso").notEmpty().withMessage("Pulso é um campo obrigatório;");
            req.assert("saturacao").notEmpty().withMessage("Saturação é um campo obrigatório;");
            req.assert("temperatura").notEmpty().withMessage("Temperatura é um campo obrigatório;");
            req.assert("altura").notEmpty().withMessage("Altura é um campo obrigatório;");
            req.assert("peso").notEmpty().withMessage("Peso é um campo obrigatório;");
            req.assert("historicoClinico").notEmpty().withMessage("Histórico clínico é um campo obrigatório;");
            req.assert("historiaProgressa").notEmpty().withMessage("História progressa é um campo obrigatório;");
            req.assert("exameFisico").notEmpty().withMessage("Exame físico é um campo obrigatório;");
            req.assert("observacoesGerais").notEmpty().withMessage("Observações gerais é um campo obrigatório;");*/
            req.assert("situacao").notEmpty().withMessage("Situação é um campo obrigatório;");
            req.assert("tipoFicha").notEmpty().withMessage("Tipo de ficha é um campo obrigatório;");

            var errors = req.validationErrors();

            if (errors) {
                res.status(400).send(errors);
                return;
            }

            salva(obj, res).then(function (response) {

                obj.id = response.insertId;

                buscarPacientePorId(obj.idPaciente, res).then(function (respPaciente) {

                    let result = respPaciente[0];

                    result.idEstabelecimento = idEstabelecimento;
                    result.idAtendimento = obj.id;

                    var client = new app.services.FichaDigitalService();

                    client.enviaFicha(result, function (status) {

                        if (status != 200) {
                            errors = util.customError(status, "FICHA DIGITAL", "Erro ao criar a ficha digital", null);
                            res.status(404).json(errors);
                        }

                        if(result.email != null){
                            obj.email = result.email;
                            mail.enviaEmailFicha(obj, "Abertura de atendimento", "createTreatment.html");
                        }


                        res.status(201).json(obj);
                    });
                });
            });

        }
        else {
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }
    });



    app.put('/atendimento/parar-atendimento', function (req, res) {

        let obj = req.body;
        let util = new app.util.Util();
        var usuario = req.usuario;
        let errors = [];
        let id = obj.id;
        delete obj.id;
        obj.idUsuario = usuario.id;

        if (usuario.idTipoUsuario == util.SUPER_ADMIN) {

            req.assert("tipo").notEmpty().withMessage("Tipo um campo obrigatório;");


            errors = req.validationErrors();

            if (errors) {
                res.status(400).send(errors);
                return;
            }

            buscarPorId(id, res).then(function (response) {
                if (typeof response != 'undefined') {
                    finalizaAtendmento(obj, id, res).then(function (response2) {
                        obj.id = id;
                        res.status(200).json(obj);
                        return;
                    });
                }
                else {
                    errors = util.customError(errors, "body", "Atendimento não encontrado!", obj.nome);
                    res.status(404).send(errors);
                    return;
                }
            });
        } else {
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }
    });


    app.put('/atendimento', function (req, res) {

        let usuario = req.usuario;
        let obj = req.body;
        let util = new app.util.Util();
        let errors = [];
        let id = obj.id;
        delete obj.id;
        delete obj.pacienteNome;
        obj.idUsuario = usuario.id;

        if (usuario.idTipoUsuario == util.SUPER_ADMIN) {

            req.assert("idPaciente").notEmpty().withMessage("Paciente um campo obrigatório;");
            /*req.assert("pressaoArterial").notEmpty().withMessage("Pressão arterial é um campo obrigatório;");
            req.assert("pulso").notEmpty().withMessage("Pulso é um campo obrigatório;");
            req.assert("saturacao").notEmpty().withMessage("Saturação é um campo obrigatório;");
            req.assert("temperatura").notEmpty().withMessage("Temperatura é um campo obrigatório;");
            req.assert("altura").notEmpty().withMessage("Altura é um campo obrigatório;");
            req.assert("peso").notEmpty().withMessage("Peso é um campo obrigatório;");
            req.assert("historicoClinico").notEmpty().withMessage("Histórico clínico é um campo obrigatório;");
            req.assert("historiaProgressa").notEmpty().withMessage("História progressa é um campo obrigatório;");
            req.assert("exameFisico").notEmpty().withMessage("Exame físico é um campo obrigatório;");
            req.assert("observacoesGerais").notEmpty().withMessage("Observações gerais é um campo obrigatório;");*/
            req.assert("situacao").notEmpty().withMessage("Situação é um campo obrigatório;");
            req.assert("tipoFicha").notEmpty().withMessage("Tipo de ficha é um campo obrigatório;");

            errors = req.validationErrors();

            if (errors) {
                res.status(400).send(errors);
                return;
            }

            buscarPorId(id, res).then(function (response) {
                if (typeof response != 'undefined') {
                    atualizaPorId(obj, id, res).then(function (response2) {
                        obj.id = id;
                        res.status(200).json(obj);
                        return;
                    });
                }
                else {
                    errors = util.customError(errors, "body", "Atendimento não encontrado!", obj.nome);
                    res.status(404).send(errors);
                    return;
                }
            });
        } else {
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }
    });

    app.delete('/atendimento/:id', function (req, res) {
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


    app.get('/atendimento/dominios', function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let addFilter = req.query;
        let errors = [];

        if (usuario.idTipoUsuario == util.SUPER_ADMIN) {
            lista(addFilter, res).then(function (resposne) {
                res.status(200).json(resposne);
                return;
            });
        }
        /*else{
            listaPorUsuario(usuario, addFilter, res).then(function (resposne) {
                res.status(200).json(resposne);
                return;
            });
        }*/

    });


    function lista(addFilter, res) {

        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();
        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.AtendimentoDAO(connection);

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
        var objDAO = new app.dao.AtendimentoDAO(connection);
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

    function buscaPorPacienteId(id, usuario, idEstabelecimento, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.AtendimentoDAO(connection);
        var errors = [];

        objDAO.buscaPorPacienteId(id, usuario, idEstabelecimento, function (exception, result) {
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
        var objDAO = new app.dao.AtendimentoDAO(connection);
        var errors = [];

        objDAO.deletaPorId(id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                errors = util.customError(errors, "data", "Erro ao apagar os dados", "atendimento");
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
        var objDAO = new app.dao.AtendimentoDAO(connection);
        var errors = [];

        objDAO.atualiza(obj, id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao editar os dados", "atendimento");
                res.status(500).send(errors);
                return;
            } else {
                d.resolve(result[0]);
            }
        });
        return d.promise;
    }


    function finalizaAtendmento(obj, id, res) {

        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.AtendimentoDAO(connection);
        var errors = [];

        objDAO.finaliza(obj, id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao editar os dados", "atendimento");
                res.status(500).send(errors);
                return;
            } else {
                d.resolve(result[0]);
            }
        });
        return d.promise;
    }

    function salva(atendimento, res) {
        delete atendimento.id;
        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.AtendimentoDAO(connection);
        var q = require('q');
        var d = q.defer();

        objDAO.salva(atendimento, function (exception, result) {
            if (exception) {
                console.log('Erro ao inserir atendimento', exception);
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

    function buscarPacientes(id, raio, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.AtendimentoDAO(connection);
        var errors = [];

        objDAO.buscarPacientes(id, raio, function (exception, result) {
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
        var objDAO = new app.dao.AtendimentoDAO(connection);

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

    function listaPorUsuario(usuario, addFilter, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();
        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.EstabelecimentoDAO(connection);

        var errors = [];

        objDAO.listaPorUsuario(usuario.id, addFilter, function (exception, result) {
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


    function buscarPacientePorId(id) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();
        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.PacienteDAO(connection);
        var errors = [];

        objDAO.buscaPorIdFicha(id, function (exception, result) {
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



}