module.exports = function (app) {

    app.get('/profissional', function (req, res) {
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

    app.get('/profissional/equipe/:id', function (req, res) {

        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        if (usuario.idTipoUsuario == util.SUPER_ADMIN) {
                buscarPorEquipe(id, res).then(function (response) {
                    res.status(200).json(response);
                    return;
                });
        } else {
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }
    });


    app.get('/profissional/estabelecimento/:id', function (req, res) {

        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];



        if (usuario.idTipoUsuario == util.SUPER_ADMIN) {

            buscarPorEstabelecimento(id, res).then(function (response) {
                res.status(200).json(response);
                return;
            });

        } else {
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }
    });




    app.get('/profissional/:id', function (req, res) {
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        if (usuario.idTipoUsuario == util.SUPER_ADMIN) {
            buscarPorId(id, res).then(function (response) {
                buscarEstabelecimentosPorUsuario(id, res).then(function (response2) {

                    response.estabelecimentos = response2;

                    res.status(200).json(response);
                    return;
                });
            });
        } else {
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }
    });

    app.post('/profissional', function (req, res) {
        var obj = req.body;
        var usuario = req.usuario;
        var util = new app.util.Util();
        var errors = [];
        let estabelecimentos = obj.estabelecimentos;
        let arrEstabelecimentos = [];
        let arrEstabelecimentosDim = [];
        
        if (usuario.idTipoUsuario == util.SUPER_ADMIN) {
            req.assert("cpf").notEmpty().withMessage("CPF é um campo obrigatório;");
            req.assert("nome").notEmpty().withMessage("Nome é um campo obrigatório;");
            req.assert("nomeMae").notEmpty().withMessage("Nome da Mãe é um campo obrigatório;");
            req.assert("dataNascimento").notEmpty().withMessage("Data de Nascimento é um campo obrigatório;");
            req.assert("sexo").notEmpty().withMessage("Sexo é um campo obrigatório;");
            req.assert("idNacionalidade").notEmpty().withMessage("Nacionalidade é um campo obrigatório;");
            req.assert("idNaturalidade").notEmpty().withMessage("Naturalidade é um campo obrigatório;");
            req.assert("profissionalSus").notEmpty().withMessage("Profissional SUS é um campo obrigatório;");
            req.assert("rg").notEmpty().withMessage("RG é um campo obrigatório;");
            req.assert("orgaoEmissor").notEmpty().withMessage("Órgão Emissor é um campo obrigatório;");
            req.assert("escolaridade").notEmpty().withMessage("Escolaridade é um campo obrigatório;");
            req.assert("cep").notEmpty().withMessage("CEP é um campo obrigatório;");
            req.assert("logradouro").notEmpty().withMessage("Logradouro é um campo obrigatório;");
            req.assert("numero").notEmpty().withMessage("Número é um campo obrigatório;");
            req.assert("idMunicipio").notEmpty().withMessage("Munícipio é um campo obrigatório;");
            req.assert("idUf").notEmpty().withMessage("UF é um campo obrigatório;");
            req.assert("bairro").notEmpty().withMessage("Bairro é um campo obrigatório;");
            req.assert("foneCelular").notEmpty().withMessage("Fone Celular é um campo obrigatório;");
            req.assert("email").notEmpty().withMessage("Email é um campo obrigatório;");
            req.assert("idEspecialidade").notEmpty().withMessage("Especialidade é um campo obrigatório;");
            req.assert("vinculo").notEmpty().withMessage("Especialidade é um campo obrigatório;");
            req.assert("cargaHorariaSemanal").notEmpty().withMessage("Carga Horária Semanal é um campo obrigatório;");
            req.assert("cargoProfissional").notEmpty().withMessage("Cargo Profissional é um campo obrigatório;");
            req.assert("estabelecimentos").notEmpty().withMessage("Estabelecimento é um campo obrigatório;");

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


            delete obj.estabelecimentos;


            salva(obj, res).then(function (response) {
                obj.id = response.insertId;

                for (var i = 0; i < estabelecimentos.length; i++) {
                    arrEstabelecimentos.push("(" + obj.id + ", " + estabelecimentos[i].id + ")");
                }

                deletaEstabelecimentosPorProfissional(obj.id, res).then(function (response3) {
                    atualizaEstabelecimentosPorProfissional(arrEstabelecimentos, res).then(function (response4) {
                        buscaEstabelecimentoPorProfissionalParaDim(obj.id, res).then(function (response5) {
                            
                            estabelecimentosDIM = response5;                           

                            for (var i = 0; i < estabelecimentosDIM.length; i++) {
                                arrEstabelecimentosDim.push("(" + estabelecimentosDIM[i].idUnidadeCorrespondenteDim + ", " + estabelecimentosDIM[i].idProfissionalCorrespondenteDim + ", NOW(), 6)");
                            }
                            
                            atualizaEstabelecimentosPorProfissionalDim(arrEstabelecimentosDim, res).then(function (response6) {
                                res.status(201).json(obj);
                                return;
                            });
                        });
                    });
                });
            });

        } else {
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }
    });

    app.put('/profissional', function (req, res) {
        let usuario = req.usuario;
        let obj = req.body;
        let util = new app.util.Util();
        let errors = [];
        let id = obj.id;
        let estabelecimentos = obj.estabelecimentos;
        let arrEstabelecimentos = [];
        let arrEstabelecimentosDim = [];

        if (usuario.idTipoUsuario == util.SUPER_ADMIN) {
            req.assert("cpf").notEmpty().withMessage("CPF é um campo obrigatório;");
            req.assert("nome").notEmpty().withMessage("Nome é um campo obrigatório;");
            req.assert("nomeMae").notEmpty().withMessage("Nome da Mãe é um campo obrigatório;");
            req.assert("dataNascimento").notEmpty().withMessage("Data de Nascimento é um campo obrigatório;");
            req.assert("sexo").notEmpty().withMessage("Sexo é um campo obrigatório;");
            req.assert("idNacionalidade").notEmpty().withMessage("Nacionalidade é um campo obrigatório;");
            req.assert("idNaturalidade").notEmpty().withMessage("Naturalidade é um campo obrigatório;");
            req.assert("profissionalSus").notEmpty().withMessage("Profissional SUS é um campo obrigatório;");
            req.assert("rg").notEmpty().withMessage("RG é um campo obrigatório;");
            req.assert("orgaoEmissor").notEmpty().withMessage("Órgão Emissor é um campo obrigatório;");
            req.assert("escolaridade").notEmpty().withMessage("Escolaridade é um campo obrigatório;");
            req.assert("cep").notEmpty().withMessage("CEP é um campo obrigatório;");
            req.assert("logradouro").notEmpty().withMessage("Logradouro é um campo obrigatório;");
            req.assert("numero").notEmpty().withMessage("Número é um campo obrigatório;");
            req.assert("idMunicipio").notEmpty().withMessage("Munícipio é um campo obrigatório;");
            req.assert("idUf").notEmpty().withMessage("UF é um campo obrigatório;");
            req.assert("bairro").notEmpty().withMessage("Bairro é um campo obrigatório;");
            req.assert("foneCelular").notEmpty().withMessage("Fone Celular é um campo obrigatório;");
            req.assert("email").notEmpty().withMessage("Email é um campo obrigatório;");
            req.assert("idEspecialidade").notEmpty().withMessage("Especialidade é um campo obrigatório;");
            req.assert("vinculo").notEmpty().withMessage("Especialidade é um campo obrigatório;");
            req.assert("cargaHorariaSemanal").notEmpty().withMessage("Carga Horária Semanal é um campo obrigatório;");
            req.assert("cargoProfissional").notEmpty().withMessage("Cargo Profissional é um campo obrigatório;");
            req.assert("estabelecimentos").notEmpty().withMessage("Estabelecimento é um campo obrigatório;");

            errors = req.validationErrors();

            if (errors) {
                res.status(400).send(errors);
                return;
            }

            if (obj.dataEmissao != null) {
                obj.dataEmissao = util.dateToISO(obj.dataEmissao);
            }
            obj.dataNascimento = util.dateToISO(obj.dataNascimento);

            delete obj.estabelecimentos;

            buscarPorId(id, res).then(function (response) {

                if (typeof response != 'undefined') {
                    atualizaPorId(obj, id, res).then(function (response2) {

                        obj.id = id;

                        for (var i = 0; i < estabelecimentos.length; i++) {
                            arrEstabelecimentos.push("(" + obj.id + ", " + estabelecimentos[i].id + ")");
                        }

                        deletaEstabelecimentosPorProfissional(obj.id, res).then(function (response3) {
                            atualizaEstabelecimentosPorProfissional(arrEstabelecimentos, res).then(function (response4) {
                                buscaEstabelecimentoPorProfissionalParaDim(obj.id, res).then(function (response5) {
                                    
                                    estabelecimentosDIM = response5;                           
        
                                    for (var i = 0; i < estabelecimentosDIM.length; i++) {
                                        arrEstabelecimentosDim.push("(" + estabelecimentosDIM[i].idUnidadeCorrespondenteDim + ", " + estabelecimentosDIM[i].idProfissionalCorrespondenteDim + ", NOW(), 6)");
                                    }
                                    
                                    atualizaEstabelecimentosPorProfissionalDim(arrEstabelecimentosDim, res).then(function (response6) {
                                        res.status(201).json(obj);
                                        return;
                                    });
                                });
                            });
                        });
                    });

                } else {
                    errors = util.customError(errors, "body", "Profissional não encontrado!", obj.nome);
                    res.status(404).send(errors);
                    return;
                }
            });

        } else {
            errors = util.customError(errors, "header", "Não autorizado!", "acesso");
            res.status(401).send(errors);
        }
    });

    app.delete('/profissional/:id', function (req, res) {
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

    function listaPorEstabelecimento(estabelecimento, addFilter, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();
        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.ProfissionalDAO(connection, null);

        var errors = [];

        objDAO.listaPorEstabelecimento(estabelecimento, addFilter, function (exception, result) {
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

    function lista(addFilter, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();
        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.ProfissionalDAO(connection, null);

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
        var objDAO = new app.dao.ProfissionalDAO(connection, null);
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

    function buscarPorEquipe(id, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.ProfissionalDAO(connection, null);
        var errors = [];

        objDAO.buscaPorEquipe(id, function (exception, result) {
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

    function buscarPorEstabelecimento(id, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.ProfissionalDAO(connection, null);
        var errors = [];

        objDAO.buscarPorEstabelecimento(id, function (exception, result) {
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

    function buscarEstabelecimentosPorUsuario(id, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.EstabelecimentoProfissionalDAO(connection, null);
        var errors = [];

        objDAO.buscaPorUsuario(id, function (exception, result) {
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


    function deletaPorId(id, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var connectionDim = app.dao.ConnectionFactoryDim();
        var objDAO = new app.dao.ProfissionalDAO(connection, connectionDim);
        var errors = [];

        objDAO.deletaPorId(id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                errors = util.customError(errors, "data", "Erro ao remover os dados", "profissional");
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
        var objDAO = new app.dao.ProfissionalDAO(connection, connectionDim);
        var errors = [];

        objDAO.atualiza(obj, id, function (exception, result) {

            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao editar os dados", "profissional");
                res.status(500).send(errors);
                return;
            } else {
                d.resolve(result[0]);
            }
        });
        return d.promise;
    }

    function salva(profissional, res) {
        delete profissional.id;
        var connection = app.dao.ConnectionFactory();
        var connectionDim = app.dao.ConnectionFactoryDim();
        var objDAO = new app.dao.ProfissionalDAO(connection, connectionDim);
        var q = require('q');
        var d = q.defer();

        objDAO.salva(profissional, function (exception, result) {
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


    function deletaEstabelecimentosPorProfissional(id, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var connectionDim = app.dao.ConnectionFactoryDim();
        var objDAO = new app.dao.EstabelecimentoProfissionalDAO(connection, connectionDim);
        var errors = [];

        objDAO.deletaEstabelecimentosPorProfissional(id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao editar os dados", "apagar permissoes");
                res.status(500).send(errors);
                return;
            } else {
                d.resolve(result);
            }
        });
        return d.promise;
    }

    function atualizaEstabelecimentosPorProfissional(estabelecimentos, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var connectionDim = app.dao.ConnectionFactoryDim();
        var objDAO = new app.dao.EstabelecimentoProfissionalDAO(connection, connectionDim);
        var errors = [];

        objDAO.atualizaEstabelecimentosPorProfissional(estabelecimentos, function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao editar os dados", "apagar permissoes");
                res.status(500).send(errors);
                return;
            } else {
                d.resolve(result);
            }
        });
        return d.promise;
    }

    function atualizaEstabelecimentosPorProfissionalDim(estabelecimentos, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connectionDim = app.dao.ConnectionFactoryDim();
        var objDAO = new app.dao.EstabelecimentoProfissionalDAO(null, connectionDim);
        var errors = [];

        objDAO.atualizaEstabelecimentosPorProfissionalDim(estabelecimentos, function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao editar os dados", "apagar permissoes");
                res.status(500).send(errors);
                return;
            } else {
                d.resolve(result);
            }
        });
        return d.promise;
    }

    function buscaEstabelecimentoPorProfissionalParaDim(id, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.EstabelecimentoProfissionalDAO(connection, null);
        var errors = [];

        objDAO.buscaEstabelecimentoPorProfissionalParaDim(id, function (exception, result) {
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