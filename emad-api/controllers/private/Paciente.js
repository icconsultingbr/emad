const { async } = require('q');

module.exports = function (app) {
    app.get('/paciente', async function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let queryFilter = req.query;
        let errors = [];

        const connection = await app.dao.connections.EatendConnection.connection();

        try {
            const pacienteRepository = new app.dao.PacienteDAO(connection);

            const response = await pacienteRepository.listarAsync(queryFilter, usuario.id);

            res.status(200).json(response);
        }
        catch (exception) {
            errors = util.customError(errors, "data", "Erro ao acessar os dados", "objs");
            res.status(500).send(errors);
        }
        finally {
            await connection.close();
        }
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

            var gruposAtencaoContinuada = await atencaoContinuadaPacienteRepository.buscaPorPacienteSync(id);
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
        req.assert("cartaoSus").isLength({ min: 0, max: 50 }).withMessage("O campo Cartão SUS deve ter no máximo 50 caracteres");
        req.assert("numeroProntuario").isLength({ min: 0, max: 20 }).withMessage("O campo Número prontuário deve ter no máximo 20 caracteres");
        req.assert("numeroProntuarioCnes").isLength({ min: 0, max: 20 }).withMessage("O campo Número prontuário Cnes deve ter no máximo 20 caracteres");

        var errors = req.validationErrors();

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        delete obj.gruposAtencaoContinuada;
        delete obj.idade;
        delete obj.idEstabelecimento;
        delete obj.pesquisaCentral;
        delete obj.pacienteOutroEstabelecimento;
        delete obj.pacienteIdade;

        obj.dataCriacao = new Date;
        obj.idUsuarioCriacao = usuario.id;

        if (obj.dataEmissao != null) {
            if (obj.dataEmissao.length == 10)
                obj.dataEmissao = util.dateToISO(obj.dataEmissao);
            else
                obj.dataEmissao = new Date(obj.dataEmissao);
        }

        if (obj.dataNascimento.length == 10)
            obj.dataNascimento = util.dateToISO(obj.dataNascimento);
        else
            obj.dataNascimento = new Date(obj.dataNascimento);

        const connection = await app.dao.connections.EatendConnection.connection();

        const pacienteRepository = new app.dao.PacienteDAO(connection, null);
        const atencaoContinuadaPacienteRepository = new app.dao.AtencaoContinuadaPacienteDAO(connection);

        try {
            await connection.beginTransaction();

            var responseBuscaCpf = await pacienteRepository.validaPorChaveSync("CPF", obj, null);

            if (responseBuscaCpf.length > 0) {
                errors = util.customError(errors, "header", "Já existe um paciente cadastrado com este CPF! (Estabelecimento: " + responseBuscaCpf[0].nomeEstabelecimento + ")", "");
                res.status(400).send(errors);
                await connection.rollback();
                return;
            }

            var responseBuscaSAP = await pacienteRepository.validaPorChaveSync("SAP", obj, null);

            if (responseBuscaSAP.length > 0) {
                errors = util.customError(errors, "header", "Já existe um paciente cadastrado com este ID SAP! (Estabelecimento: " + responseBuscaSAP[0].nomeEstabelecimento + ")", "");
                res.status(400).send(errors);
                await connection.rollback();
                return;
            }

            var responseBuscaSUS = await pacienteRepository.validaPorChaveSync("SUS", obj, null);

            if (responseBuscaSUS.length > 0) {
                errors = util.customError(errors, "header", "Já existe um paciente cadastrado com este número do cartão SUS! (Estabelecimento: " + responseBuscaSUS[0].nomeEstabelecimento + ")", "");
                res.status(400).send(errors);
                await connection.rollback();
                return;
            }

            var responseBuscaRG = await pacienteRepository.validaPorChaveSync("RG", obj, null);

            if (responseBuscaRG.length > 0) {
                errors = util.customError(errors, "header", "Já existe um paciente cadastrado com este RG! (Estabelecimento: " + responseBuscaRG[0].nomeEstabelecimento + ")", "");
                res.status(400).send(errors);
                await connection.rollback();
                return;
            }

            var response = await pacienteRepository.salvaAsync(obj);
            obj.id = response[0].insertId;

            var responseEstabelecimento = await pacienteRepository.gravaEstabelecimento(obj, new Date, usuario.id);

            if (gruposAtencaoContinuada) {
                for (const item of gruposAtencaoContinuada) {
                    arrAtencaoContinuada.push("(" + obj.id + ", " + item.id + ")");
                }
            }

            if (arrAtencaoContinuada.length > 0)
                var atualizaResult = await atencaoContinuadaPacienteRepository.atualizaGrupoPorPacienteSync(arrAtencaoContinuada);

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

    app.put('/paciente/transferencia-unidade', async function (req, res) {
        let paciente = req.body;
        let usuario = req.usuario;
        const util = new app.util.Util();
        let errors = [];

        req.assert("idEstabelecimentoCadastro").notEmpty().withMessage("O campo Estabelecimento é um campo obrigatório");
        req.assert("id").notEmpty().withMessage("Paciente não encontrado");

        errors = req.validationErrors();

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        const connection = await app.dao.connections.EatendConnection.connection();
        const pacienteRepository = new app.dao.PacienteDAO(connection);

        try {
            await connection.beginTransaction();

            paciente.dataAlteracao = new Date;
            paciente.idUsuarioAlteracao = usuario.id;

            var responseEstabelecimento = await pacienteRepository.gravaEstabelecimento(paciente, new Date, usuario.id);

            var response = await pacienteRepository.transferirUnidade(paciente);
            res.status(201).send(paciente);

            await connection.commit();
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado" + exception, ""));
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

        req.assert("nome").notEmpty().withMessage("Nome é um campo obrigatório;");
        req.assert("nomeMae").notEmpty().withMessage("Nome da mãe é um campo obrigatório;");
        req.assert("dataNascimento").notEmpty().withMessage("Data de nascimento é um campo obrigatório;");
        req.assert("sexo").notEmpty().withMessage("Sexo é um campo obrigatório;");
        req.assert("idNacionalidade").notEmpty().withMessage("Nacionalidade é um campo obrigatório;");
        req.assert("idNaturalidade").notEmpty().withMessage("Naturalidade é um campo obrigatório;");
        req.assert("escolaridade").notEmpty().withMessage("Escolaridade é um campo obrigatório;");
        req.assert("situacao").notEmpty().withMessage("Situação é um campo obrigatório;");
        req.assert("idSap").isLength({ min: 0, max: 20 }).withMessage("O campo ID SAP deve ter no máximo 20 caracteres");
        req.assert("cartaoSus").isLength({ min: 0, max: 50 }).withMessage("O campo Cartão SUS deve ter no máximo 50 caracteres");
        req.assert("numeroProntuario").isLength({ min: 0, max: 20 }).withMessage("O campo Número prontuário deve ter no máximo 20 caracteres");
        req.assert("numeroProntuarioCnes").isLength({ min: 0, max: 20 }).withMessage("O campo Número prontuário Cnes deve ter no máximo 20 caracteres");

        errors = req.validationErrors();

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        delete obj.gruposAtencaoContinuada;
        delete obj.dataCriacao;
        delete obj.idUsuarioCriacao;
        delete obj.pacienteOutroEstabelecimento;
        delete obj.pacienteIdade;

        obj.dataAlteracao = new Date;
        obj.idUsuarioAlteracao = usuario.id;

        if (obj.dataEmissao != null) {
            if (obj.dataEmissao.length == 10)
                obj.dataEmissao = util.dateToISO(obj.dataEmissao);
            else
                obj.dataEmissao = new Date(obj.dataEmissao);
        }

        if (obj.dataNascimento.length == 10)
            obj.dataNascimento = util.dateToISO(obj.dataNascimento);
        else
            obj.dataNascimento = new Date(obj.dataNascimento);

        const connection = await app.dao.connections.EatendConnection.connection();

        const pacienteRepository = new app.dao.PacienteDAO(connection);
        const atencaoContinuadaPacienteRepository = new app.dao.AtencaoContinuadaPacienteDAO(connection);

        try {
            await connection.beginTransaction();

            var responseBuscaCpf = await pacienteRepository.validaPorChaveSync("CPF", obj, id);

            if (responseBuscaCpf.length > 0) {
                errors = util.customError(errors, "header", "Já existe um paciente cadastrado com este CPF! (Estabelecimento: " + responseBuscaCpf[0].nomeEstabelecimento + ")", "");
                res.status(400).send(errors);
                await connection.rollback();
                return;
            }

            var responseBuscaSAP = await pacienteRepository.validaPorChaveSync("SAP", obj, id);

            if (responseBuscaSAP.length > 0) {
                errors = util.customError(errors, "header", "Já existe um paciente cadastrado com este ID SAP! (Estabelecimento: " + responseBuscaSAP[0].nomeEstabelecimento + ")", "");
                res.status(400).send(errors);
                await connection.rollback();
                return;
            }

            var responseBuscaSUS = await pacienteRepository.validaPorChaveSync("SUS", obj, id);

            if (responseBuscaSUS.length > 0) {
                errors = util.customError(errors, "header", "Já existe um paciente cadastrado com este número do cartão SUS! (Estabelecimento: " + responseBuscaSUS[0].nomeEstabelecimento + ")", "");
                res.status(400).send(errors);
                await connection.rollback();
                return;
            }

            var responseBuscaRG = await pacienteRepository.validaPorChaveSync("RG", obj, id);

            if (responseBuscaRG.length > 0) {
                errors = util.customError(errors, "header", "Já existe um paciente cadastrado com este RG! (Estabelecimento: " + responseBuscaRG[0].nomeEstabelecimento + ")", "");
                res.status(400).send(errors);
                await connection.rollback();
                return;
            }

            var response = await pacienteRepository.atualizaAsync(obj, id);

            var deleteResult = await atencaoContinuadaPacienteRepository.deletaGrupoPorPacienteSync(id);

            if (gruposAtencaoContinuada) {
                for (const item of gruposAtencaoContinuada) {
                    arrAtencaoContinuada.push("(" + id + ", " + item.id + ")");
                }
            }

            if (arrAtencaoContinuada.length > 0)
                var atualizaResult = await atencaoContinuadaPacienteRepository.atualizaGrupoPorPacienteSync(arrAtencaoContinuada);

            res.status(201).send(obj);
            await connection.commit();
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado: " + exception, ""));
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

    app.get('/paciente/material/filtros', async function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let errors = [];
        let addFilter = req.query;

        const connection = await app.dao.connections.EatendConnection.connection();

        const pacienteRepository = new app.dao.PacienteDAO(connection);

        try {
            var response = {};

            response.listaMateriais = await pacienteRepository.carregaPacientePorMedicamento(addFilter, true);
            response.totalGeralReceitas = 0;
            response.totalGeralRetiradas = 0;

            if (response.listaMateriais.length > 0) {
                for (const itemMaterial of response.listaMateriais) {
                    addFilter.idMaterial = itemMaterial.idMaterial;
                    response.totalGeralReceitas += itemMaterial.medicamentosPorUnidade;
                    response.totalGeralRetiradas += itemMaterial.qtdRetirada;

                    var pacientesMaterial = await pacienteRepository.carregaPacientePorMedicamento(addFilter, false);
                    itemMaterial.pacientesMaterial = pacientesMaterial ? pacientesMaterial : null;
                }
            }
            res.status(200).json(response);
        }
        catch (exception) {
            console.log("Erro ao carregar o registro, exception: " + exception);
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));
        }
        finally {
            await connection.close();
        }
    });


    app.get('/paciente/prontuario/report/:idPaciente', async function (req, res) {
        let idPaciente = req.params.idPaciente;

        const connection = await app.dao.connections.EatendConnection.connection();
        const pacienteRepository = new app.dao.PacienteDAO(connection);
        const atencaoContinuadaPacienteRepository = new app.dao.AtencaoContinuadaPacienteDAO(connection);
        const atendimentoRepository = new app.dao.AtendimentoDAO(connection);
        const atendimentoHipoteseRepository = new app.dao.AtendimentoHipoteseDiagnosticaDAO(connection);
        const receitaRepository = new app.dao.ReceitaDAO(connection);
        const itemReceitaRepository = new app.dao.ItemReceitaDAO(connection);
        const estabelecimentoRepository = new app.dao.EstabelecimentoDAO(connection);
        const nacionalidadeRepository = new app.dao.NacionalidadeDAO(connection);
        const ufRepository = new app.dao.UfDAO(connection);
        const exameRepository = new app.dao.ExameDAO(connection);

        try {
            let paciente = await pacienteRepository.buscaPorIdSync(idPaciente);
            let gruposAtencaoContinuada = await atencaoContinuadaPacienteRepository.buscaPorPacienteSync(idPaciente);
            paciente[0].gruposAtencaoContinuada = gruposAtencaoContinuada;
            const sinaisVitais = await atendimentoRepository.buscaSinaisVitaisPorPacienteId(idPaciente, '');
            const nacionalidade = await nacionalidadeRepository.buscaPorIdSync(paciente[0].idNacionalidade);
            const naturalidade = await ufRepository.buscaPorIdSync(paciente[0].idNaturalidade);
            
            if(nacionalidade) {
                paciente[0].nacionalidadeNome = nacionalidade[0].nome;
            }

            if(naturalidade) {
                paciente[0].naturalidadeNome = naturalidade[0].nome;
            }

            if(paciente[0].escolaridade) {
                paciente[0].escolaridadeNome = escolaridade.find(x => x.id == paciente[0].escolaridade).nome;
            }

            let atendimentos = await atendimentoRepository.buscaPorPacienteIdProntuario(idPaciente, 1);
            if (atendimentos) {
                for (let atendimento of atendimentos) {               
                    let historicos = await atendimentoRepository.buscaHistoricoPorAtendimento(atendimento.id);
                    atendimento.historicos = historicos;
                }
            }

            let receitas = await receitaRepository.buscaPorPacienteIdProntuario(idPaciente);
            if (receitas) {
                for (let receita of receitas) {               
                    let itens = await itemReceitaRepository.buscarPorReceita(receita.id);
                    receita.itensReceita = itens;
                }
            }

            const fichasAtendimento = await atendimentoRepository.buscaPorPacienteIdProntuario(idPaciente, 2);
            const exames = await exameRepository.buscaPorPacienteId(idPaciente);
            const hipoteseDiagnostica = await atendimentoHipoteseRepository.listarPorPaciente(idPaciente);
            const vacinas = await receitaRepository.buscaPorPacienteIdProntuarioVacinacao(idPaciente);
            const estabelecimento = await estabelecimentoRepository.carregaPorId(paciente[0].idEstabelecimentoCadastro)

            let response = { paciente, estabelecimento, sinaisVitais, atendimentos, receitas, fichasAtendimento, exames, hipoteseDiagnostica, vacinas };

            res.status(200).json(response);

        } catch (error) {

        } finally {
            await connection.close();
        }
    });

    app.put('/paciente/:idSap/transferencia-unidade/:idUnidadeDestino', async function (req, res) {
        let idSapPaciente = req.params.idSap;
        let idUnidadeDestino = req.params.idUnidadeDestino;
        let usuario = req.usuario;
        let errors = [];
        const util = new app.util.Util();

        const connection = await app.dao.connections.EatendConnection.connection();
        const pacienteRepository = new app.dao.PacienteDAO(connection);

        try {
            await connection.beginTransaction();

            let paciente = await pacienteRepository.buscaPacientePorSapId(idSapPaciente);
            paciente.dataAlteracao = new Date;
            paciente.idUsuarioAlteracao = usuario.id;

            if(!paciente) {
                errors = util.customError(errors, "header", "Não existe nenhum paciente cadastrado com este ID SAP!", "");
                res.status(400).send(errors);
                return;
            }

            await pacienteRepository.gravaEstabelecimento(paciente, new Date, usuario.id);

            paciente.idEstabelecimentoCadastro = idUnidadeDestino;

            await pacienteRepository.transferirUnidade(paciente);

            res.status(201).send(paciente);

            await connection.commit();
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado" + exception, ""));
            await connection.rollback();
        }
        finally {
            await connection.close();
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

    const escolaridade = [
        { id: 1, nome: "Educação infantil" },
        { id: 2, nome: "Fundamental" },
        { id: 3, nome: "Médio" },
        { id: 4, nome: "Superior (Graduação)" },
        { id: 5, nome: "Pós-graduação" },
        { id: 6, nome: "Mestrado" },
        { id: 7, nome: "Doutorado" },
        { id: 8, nome: "Escola" },
        { id: 9, nome: "Analfabeto" },
        { id: 10, nome: "Não informado" }
      ];

}