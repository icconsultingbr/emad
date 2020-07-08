module.exports = function (app) {


    app.get('/atendimento', async function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let queryFilter = req.query;
        let errors = [];

        try {
            const connection = app.dao.connections.EatendConnection();

            const atendimentoRepository = new app.dao.AtendimentoDAO(connection);

            const response = await atendimentoRepository.listarAsync(queryFilter);

            res.status(200).json(response);
        }
        catch (exception) {
            errors = util.customError(errors, "data", "Erro ao acessar os dados", "objs");
            res.status(500).send(errors);
        }
    });

    app.post('/atendimento/print-document', function (req, res) {
        let usuario = req.usuario;

        console.log('teste')
        res.status(200).json({ id: 1 });
    });

    app.post('/atendimento/consulta-por-paciente', function (req, res) {
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

    app.post('/atendimento/receita-medica', function (req, res) {
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

        buscarPorId(id, res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.get('/atendimento/paciente/:id/:idEstabelecimento', function (req, res) {
        let usuario = req.usuario;
        let id = req.params.id;
        let idEstabelecimento = req.params.idEstabelecimento;
        let util = new app.util.Util();
        let errors = [];

        buscaPorPacienteId(id, usuario, idEstabelecimento, res).then(function (response) {
            res.status(200).json(response);
            return;
        });
    });

    app.post('/atendimento', function (req, res) {
        var obj = req.body;
        var usuario = req.usuario;
        var util = new app.util.Util();
        delete obj.pacienteNome;
        obj.idUsuario = usuario.id;
        obj.idUsuarioAlteracao = null;
        let idEstabelecimento = req.headers.est;
        let mail = new app.util.Mail();

        if (!obj.situacao)
            obj.situacao = "C";

        req.assert("idPaciente").notEmpty().withMessage("Paciente um campo obrigatório;");
        req.assert("situacao").notEmpty().withMessage("Situação é um campo obrigatório;");
        req.assert("tipoFicha").notEmpty().withMessage("Tipo de ficha é um campo obrigatório;");
        req.assert("idClassificacaoRisco").notEmpty().withMessage("Classificação de risco é um campo obrigatório;");

        let errors = req.validationErrors();

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        let dadosPaciente = [];
        let templateFicha = [];
        let urlFicha = "";
        let emailRemetente = "";
        let senhaRemetente = "";
        let emailProfissional = "";
        let emailPaciente = "";

        buscaProfissionalPorUsuario(usuario.id).then(function (responseProfissional) {
            if (responseProfissional.length > 0) {
                emailProfissional = responseProfissional[0].email;
                return salva(obj, res);
            }
            else {
                errors = util.customError(errors, "usuário", "O seu usuário não possui profissional vinculado, não é permitido criar/alterar atendimentos", "404");
                return Promise.reject(errors);
            }
        })
            .then(function (response) {
                if (response) {
                    obj.id = response.insertId;
                    obj.emailProfissional = emailProfissional;
                    let buscaChaves = "'URL_FICHA_DIGITAL_SERVICO','CONTA_EMAIL', 'SENHA_EMAIL'";
                    return buscaParametroSegurancaPorChave(buscaChaves, res);
                }
                else {
                    errors = util.customError(errors, "atendimento", "Erro ao salvar o atendimento");
                    return Promise.reject(errors);
                }
            })
            .then(function (responseURL) {
                if (responseURL) {
                    urlFicha = responseURL.filter((url) => url.NOME == "URL_FICHA_DIGITAL_SERVICO")[0].VALOR;
                    emailRemetente = responseURL.filter((url) => url.NOME == "CONTA_EMAIL")[0].VALOR;
                    senhaRemetente = responseURL.filter((url) => url.NOME == "SENHA_EMAIL")[0].VALOR;
                    return buscaEmailPaciente(obj.idPaciente, res);
                }
                else {
                    errors = util.customError(errors, "FICHA DIGITAL", "URL para envio da ficha digital não foi encontrada", null);
                    return Promise.reject(errors);
                }
            }).then(function (responseEmailPaciente) {
                if (responseEmailPaciente) {
                    console.log(responseEmailPaciente.email);

                    if (responseEmailPaciente.email != null) {
                        obj.email = responseEmailPaciente.email;
                        mail.enviaEmailFicha(obj, emailRemetente, senhaRemetente, "Abertura de atendimento", "createTreatment.html");
                        return buscaTemplatePorTipoFicha(obj.tipoFicha, res);
                    }
                    else {
                        return buscaTemplatePorTipoFicha(obj.tipoFicha, res);
                    }
                }
                else {
                    errors = util.customError(errors, "FICHA DIGITAL", "Erro ao buscar o e-mail do paciente", status);
                    return Promise.reject(errors);
                }
            }).then(function (template) {
                if (template.queryTemplate != null && template.xmlTemplate != null) {
                    templateFicha = template;
                    obj.templateFicha = templateFicha;
                    return buscaDadosEnvioFicha(templateFicha.queryTemplate, obj.id);
                }
                else {
                    res.status(201).json(obj);
                    return Promise.resolve(obj);
                }
            }).then(function (dadosFicha) {
                if (dadosFicha != null && obj.templateFicha.queryTemplate != null && obj.templateFicha.xmlTemplate != null) {
                    obj.dadosFicha = dadosFicha;
                    var client = new app.services.FichaDigitalService();
                    return client.enviaFicha(dadosFicha, urlFicha, templateFicha.xmlTemplate);
                }
                else {
                    res.status(201).json(obj);
                    return Promise.resolve(obj);
                }
            }).then(function (status) {
                res.status(201).json(obj);
                return Promise.resolve(obj);
            }).catch(function (error) {
                return res.status(400).json(error);
            });
    });

    app.put('/atendimento/parar-atendimento', function (req, res) {

        let obj = req.body;
        let util = new app.util.Util();
        var usuario = req.usuario;
        let errors = [];
        let id = obj.id;
        delete obj.id;
        obj.idUsuarioAlteracao = usuario.id;
        delete obj.idUsuario;

        req.assert("tipo").notEmpty().withMessage("Tipo um campo obrigatório;");

        if (obj.tipo == "X")
            req.assert("motivoCancelamento").notEmpty().withMessage("Motivo do cancelamento é obrigatório;");


        errors = req.validationErrors();

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        buscaProfissionalPorUsuario(usuario.id).then(function (response) {
            if (response.length > 0) {
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
                        res.status(400).send(errors);
                        return;
                    }
                });
            }
            else {
                errors = util.customError(errors, "usuário", "O seu usuário não possui profissional vinculado, não é permitido criar/alterar atendimentos");
                res.status(400).json(errors);
                return;
            }
        })
    });

    app.put('/atendimento', async function (req, res) {
        let usuario = req.usuario;
        let obj = req.body;
        let util = new app.util.Util();
        let errors = [];
        let id = obj.id;
        delete obj.id;
        delete obj.pacienteNome;
        obj.idUsuarioAlteracao = usuario.id;
        delete obj.idUsuario;

        req.assert("idPaciente").notEmpty().withMessage("Paciente um campo obrigatório;");
        req.assert("situacao").notEmpty().withMessage("Situação é um campo obrigatório;");
        req.assert("tipoFicha").notEmpty().withMessage("Tipo de ficha é um campo obrigatório;");
        req.assert("idClassificacaoRisco").notEmpty().withMessage("Classificação de risco é um campo obrigatório;");

        errors = req.validationErrors();

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        let medicamentos = [];
        let responsePorId = [];
        let receita = {};

        const connection = app.dao.connections.EatendConnection();

        const receitaRepository = new app.dao.ReceitaDAO(connection);
        const itemReceitaRepository = new app.dao.ItemReceitaDAO(connection);
        const profissionalRepository = new app.dao.ProfissionalDAO(connection);
        const atendimentoRepository = new app.dao.AtendimentoDAO(connection);
        const atendimentoMedicamentoRepository = new app.dao.AtendimentoMedicamentoDAO(connection);

        try {

            await connection.beginTransaction();

            var buscaProfissional = await profissionalRepository.buscaProfissionalPorUsuarioSync(usuario.id);

            if (!buscaProfissional) {
                errors = util.customError(errors, "header", "O seu usuário não possui profissional vinculado, não é permitido criar/alterar atendimentos", "");
                res.status(400).send(errors);
                await connection.rollback();
                return;
            }

            var buscaAtendimento = await atendimentoRepository.buscaPorIdSync(id);

            if (!buscaAtendimento) {
                errors = util.customError(errors, "header", "Atendimento não encontrado", "");
                res.status(400).send(errors);
                await connection.rollback();
                return;
            }

            obj.idReceita = buscaAtendimento.idReceita ? buscaAtendimento.idReceita : 0;

            var receitaExistente = await receitaRepository.buscaPorId(obj.idReceita);

            var buscaMedicamentoAtendimento = await atendimentoMedicamentoRepository.buscaMedicamentoReceitaSync(id);

            receita.itensReceita = buscaMedicamentoAtendimento;

            if (!buscaAtendimento.idReceita && receita.itensReceita.length > 0) {
                receita.ano = new Date().getFullYear();
                receita.idPaciente = buscaAtendimento.idPaciente;
                receita.idProfissional = buscaProfissional.id;
                receita.idEstabelecimento = buscaAtendimento.idEstabelecimento;
                receita.idUf = buscaAtendimento.idUfEstabelecimento;
                receita.idMunicipio = buscaAtendimento.idMunicipioEstabelecimento;
                receita.idSubgrupoOrigem = 1;
                receita.dataEmissao = new Date();
                receita.dataCriacao = new Date;
                receita.idUsuarioCriacao = usuario.id;
                receita.situacao = 2;

                receita.numero = await receitaRepository.obterProximoNumero(receita.ano, receita.idEstabelecimento);
                var response = await receitaRepository.salva(receita);
                receita.id = response[0].insertId;

                if (receita.id <= 0) {
                    errors = util.customError(errors, "header", "Erro ao criar a receita", "");
                    res.status(400).send(errors);
                    await connection.rollback();
                    return;
                }

                obj.idReceita = receita.id;
                obj.numeroReceita = receita.numero;
            }

            if (receitaExistente.length == 0 || receitaExistente[0].situacao == '2') {
                //Gravar itens da receita
                for (const itemReceita of receita.itensReceita) {
                    itemReceita.idReceita = obj.idReceita;
                    itemReceita.dataCriacao = new Date;
                    itemReceita.idUsuarioCriacao = usuario.id;
                    itemReceita.situacao = itemReceita.situacao ? itemReceita.situacao : 1; //ABERTO                        
                    itemReceita.qtdDispAnterior = itemReceita.qtdDispAnterior ? itemReceita.qtdDispAnterior : 0;
                    itemReceita.qtdDispMes = itemReceita.qtdDispMes ? itemReceita.qtdDispMes : 0;

                    if (itemReceita.id) {
                        delete itemReceita.dataCriacao;
                        delete itemReceita.idUsuarioCriacao;
                        itemReceita.dataAlteracao = new Date;
                        itemReceita.idUsuarioAlteracao = usuario.id;
                        var item = await itemReceitaRepository.atualiza(itemReceita);
                    }
                    else {
                        var responseItemReceita = await itemReceitaRepository.salva(itemReceita);
                        itemReceita.id = responseItemReceita[0].insertId;
                    }
                }
            }

            var atualizaAtendimento = await atendimentoRepository.atualizaPorIdSync(obj, id);

            obj.id = id;
            res.status(201).send(obj);

            await connection.commit();
        }
        catch (exception) {
            console.log("Erro ao salvar o atendimento (" + id + "), exception: " + exception);
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));
            await connection.rollback();
        }
        finally {
            connection.close();
        }
    });

    app.delete('/atendimento/:id', function (req, res) {
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


    app.get('/atendimento/dominios', function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let addFilter = req.query;
        let errors = [];

        lista(addFilter, res).then(function (resposne) {
            res.status(200).json(resposne);
            return;
        });

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

    function buscaCabecalhoReceitaDim(id, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.AtendimentoDAO(connection);
        var errors = [];

        objDAO.buscaCabecalhoReceitaDim(id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao carregar o cabeçalho dos medicamentos", "obj");
                res.status(500).send(errors);
                return;
            } else {

                d.resolve(result[0]);
            }
        });
        return d.promise;
    }

    function buscaMedicamentoParaReceitaDim(id, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.AtendimentoMedicamentoDAO(connection);
        var errors = [];

        objDAO.buscaMedicamentoParaReceitaDim(id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao carregar medicamentos para envio da receita", "obj");
                res.status(500).send(errors);
                return;
            } else {

                d.resolve(result);
            }
        });
        return d.promise;
    }

    function buscaPorUfNomeDim(nomecidade, uf, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var connectionDim = app.dao.ConnectionFactoryDim();
        var objDAO = new app.dao.MunicipioDAO(connection, connectionDim);
        var errors = [];

        objDAO.buscaPorUfNomeDim(nomecidade, uf, function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao carregar a cidade do DIM", "obj");
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
                errors = util.customError(errors, "data", "Erro ao remover os dados", "atendimento");
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

    function confirmaMedicamentoParaReceitaDim(id, idReceita, numeroReceita, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.AtendimentoMedicamentoDAO(connection);
        var errors = [];

        objDAO.confirmaMedicamentoParaReceitaDim(id, idReceita, numeroReceita, function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao atualizar os dados dos medicamentos", "atendimento");
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
        var objDAO = new app.dao.AtendimentoDAO(connection);

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

    function buscaDadosEnvioFicha(query, id, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();
        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.AtendimentoDAO(connection);

        var errors = [];

        objDAO.buscaDadosFichaAtendimento(query, id, function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao acessar os dados", "objs");
                res.status(500).send(errors);
                return;
            } else {
                d.resolve(result[0]);
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

    function buscaProfissionalPorUsuario(id) {
        let q = require('q');
        let d = q.defer();
        let connection = app.dao.ConnectionFactory();
        let profissionalDAO = new app.dao.ProfissionalDAO(connection);

        profissionalDAO.buscaProfissionalPorUsuario(id, function (exception, result) {
            if (exception) {
                d.reject(exception);
            } else {
                d.resolve(result);
            }
        });
        return d.promise;
    }

    function buscaProfissionalAberturaAtendimento(idUsuario, id) {
        let q = require('q');
        let d = q.defer();
        let connection = app.dao.ConnectionFactory();
        let objDAO = new app.dao.AtendimentoDAO(connection);

        objDAO.buscaProfissionalAberturaAtendimento(idUsuario, id, function (exception, result) {
            if (exception) {
                d.reject(exception);
            } else {
                d.resolve(result);
            }
        });
        return d.promise;
    }

    function buscaParametroSegurancaPorChave(chave, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.ParametroSegurancaDAO(connection);
        var errors = [];
        result = [];

        objDAO.buscarValorPorChave(chave, function (exception, result) {
            if (exception) {
                d.reject(exception);
                console.log(exception);
                errors = util.customError(errors, "data", "Erro ao editar os dados", "atendimento");
                res.status(500).send(errors);
                return;
            } else {
                d.resolve(result);
            }
        });
        return d.promise;
    }

    function buscaTemplatePorTipoFicha(tipoFicha, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.TipoFichaDAO(connection);
        var errors = [];
        result = [];

        objDAO.buscaTemplatePorId(tipoFicha, function (exception, result) {
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

    function buscaEmailPaciente(idPaciente, res) {
        var q = require('q');
        var d = q.defer();
        var util = new app.util.Util();

        var connection = app.dao.ConnectionFactory();
        var objDAO = new app.dao.PacienteDAO(connection);
        var errors = [];
        result = [];

        objDAO.buscaEmailPaciente(idPaciente, function (exception, result) {
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
}