module.exports = function (app) {
    app.get('/atendimento', async function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let queryFilter = req.query;
        let errors = [];

        const connection = await app.dao.connections.EatendConnection.connection();

        try {
            const atendimentoRepository = new app.dao.AtendimentoDAO(connection);

            const response = await atendimentoRepository.listarAsync(queryFilter);

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

    app.get('/atendimento-historico/:id', async function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let id = req.params.id;
        let errors = [];

        const connection = await app.dao.connections.EatendConnection.connection();

        try {
            const atendimentoRepository = new app.dao.AtendimentoDAO(connection);

            const response = await atendimentoRepository.buscaHistoricoPorAtendimento(id);

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

    app.put('/atendimento/envia-ficha', async function (req, res) {
        var obj = req.body;
        let id = obj.id;
        let urlFicha;

        const connection = await app.dao.connections.EatendConnection.connection();
        const atendimentoRepository = new app.dao.AtendimentoDAO(connection);
        const parametroSegurancaRepository = new app.dao.ParametroSegurancaDAO(connection);
        const tipoFichaRepository = new app.dao.TipoFichaDAO(connection);

        try {

            var buscaAtendimento = await atendimentoRepository.buscaPorIdSync(id);

            if (!buscaAtendimento) {
                errors = util.customError(errors, "header", "Atendimento não encontrado", "");
                res.status(400).send(errors);
                return;
            }

            var valorChave = await parametroSegurancaRepository.buscarValorPorChaveSync("'URL_FICHA_DIGITAL_SERVICO'");

            if (valorChave) {
                urlFicha = valorChave.filter((url) => url.NOME == "URL_FICHA_DIGITAL_SERVICO")[0].VALOR;
            }
            else {
                errors = util.customError(errors, "header", "URL para envio da ficha digital não foi encontrada", "");
                res.status(400).send(errors);
                return;
            }

            var template = await tipoFichaRepository.buscaTemplatePorIdSync(buscaAtendimento.tipoFicha);

            if (template.length) {

                if (template[0].queryTemplate != null && template[0].xmlTemplate != null) {

                    var dadosFicha = await atendimentoRepository.buscaDadosFichaAtendimentoSync(template[0].queryTemplate, obj.id);

                    if (dadosFicha && dadosFicha.length) {
                        var client = new app.services.FichaDigitalService();
                        await client.enviaFichaSync(dadosFicha[0], urlFicha, template[0].xmlTemplate);
                    }
                }
            }
            res.status(201).send(buscaAtendimento);
        }
        catch (exception) {
            console.log("Erro ao enviar ficha do atendimento (" + id + "), exception: " + exception);
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));
        }
        finally {
            await connection.close();
        }
    });

    app.post('/atendimento/print-document', function (req, res) {
        let usuario = req.usuario;

        console.log('print-document')
        res.status(200).json({ id: 1 });
    });

    app.post('/atendimento/consulta-por-paciente', function (req, res) {
        let usuario = req.usuario;

        console.log('consulta-por-paciente')
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

    app.get('/atendimento/historico/:idHistorico', async function (req, res) {
        let usuario = req.usuario;
        let id = req.params.idHistorico;
        let util = new app.util.Util();
        let errors = [];

        const connection = await app.dao.connections.EatendConnection.connection();

        const atendimentoRepository = new app.dao.AtendimentoDAO(connection);

        try {
            var response = await atendimentoRepository.buscaPorHistoricoId(id);
            res.status(200).json(response[0]);
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado " + exception, ""));
        }
        finally {
            await connection.close();
        }
    });

    app.get('/atendimento/prontuario-paciente/paciente/:idPaciente/tipo-atendimento/:tipo', async function (req, res) {
        let usuario = req.usuario;
        let id = req.params.idPaciente;
        let tipo = req.params.tipo;
        let util = new app.util.Util();
        let errors = [];

        const connection = await app.dao.connections.EatendConnection.connection();

        const atendimentoRepository = new app.dao.AtendimentoDAO(connection);

        try {
            var response = await atendimentoRepository.buscaPorPacienteIdProntuario(id, tipo, 0, 0);
            var atendimentos = response;
            if (atendimentos) {
                for (const itemAtendimento of atendimentos) {
                    var historicos = await atendimentoRepository.buscaHistoricoPorAtendimento(itemAtendimento.id);
                    itemAtendimento.historicos = historicos ? historicos : null;
                }
            }
            res.status(200).json(atendimentos);
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado " + exception, ""));
        }
        finally {
            await connection.close();
        }
    });

    app.get('/atendimento/prontuario-paciente/paciente/:idPaciente/sinais-vitais/:tipo', async function (req, res) {
        let usuario = req.usuario;
        let id = req.params.idPaciente;
        let tipo = req.params.tipo;
        let util = new app.util.Util();
        let errors = [];

        const connection = await app.dao.connections.EatendConnection.connection();

        const atendimentoRepository = new app.dao.AtendimentoDAO(connection);

        try {
            var response = await atendimentoRepository.buscaSinaisVitaisPorPacienteId(id, tipo, 0, 0);
            res.status(200).json(response);
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado " + exception, ""));
        }
        finally {
            await connection.close();
        }
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

    app.post('/atendimento', async function (req, res) {
        var obj = req.body;
        var usuario = req.usuario;
        var util = new app.util.Util();
        delete obj.pacienteNome;
        delete obj.pacienteHistoriaProgressa;
        delete obj.pesquisaCentral;
        obj.idUsuario = usuario.id;
        obj.idUsuarioAlteracao = null;
        delete obj.idTipoAtendimentoHistorico;
        delete obj.textoHistorico;
        delete obj.tipoHistoriaClinica;
        var objHistorico = Object.assign({}, obj);
        var objParticipanteAtividadeColetiva = Object.assign({});
        var objProfissionalAtividadeColetiva = Object.assign({});
        let idEstabelecimento = req.headers.est;
        let mail = new app.util.Mail();
        let errors;

        if (!obj.situacao)
            obj.situacao = "C";

        req.assert("idPaciente").notEmpty().withMessage("Paciente um campo obrigatório;");
        req.assert("situacao").notEmpty().withMessage("Situação é um campo obrigatório;");
        req.assert("tipoFicha").notEmpty().withMessage("Tipo de ficha é um campo obrigatório;");
        req.assert("idClassificacaoRisco").notEmpty().withMessage("Classificação de risco é um campo obrigatório;");

        if (obj.tipoFicha != 1 && obj.tipoFicha != 8){
            delete obj.idProfissionalCompartilhado;
            delete objHistorico.idProfissionalCompartilhado;
        }

        //ATIVIDADE COLETIVA
        if (obj.tipoFicha == '7') {

            // CAMPO = INEP
            // É de preenchimento obrigatório se pseEducacao = true ou pseSaude = true;
            if (obj.pseEducacao == true && obj.pseSaude == true && obj.inep == '') {
                errors = util.customError(errors, "header", "Informe o código Inep.", "");
                res.status(400).send(errors);
                return;
            }

            // CAMPO = atividadeTipo
            // 01 - Reunião de equipe;
            // 02 - Reunião com outras equipes de saúde;
            // 03 - Reunião intersetorial / Conselho local de saúde / Controle social;
            // 05 - Atendimento em grupo.
            //Não podem ser selecionados se pseEducacao = true e pseSaude = false
            if (obj.pseEducacao == true && obj.pseSaude == false) {
                if (obj.atividadeTipo == 1 || obj.atividadeTipo == 2 || obj.atividadeTipo == 3 || obj.atividadeTipo == 5) {
                    errors = util.customError(errors, "header", "O Tipo de Atividade selecionado não pode ser utilizado quando pseEducacao selecione e pseSaude não selecionado.", "");
                    res.status(400).send(errors);
                    return;
                }
            }

            if (obj.atividadeTipo === 4 || obj.atividadeTipo === 5 || obj.atividadeTipo === 6 || obj.atividadeTipo === 7) {
                if (this.object.publicoAlvo == 0 || this.object.publicoAlvo == null) {
                    errors = util.customError(errors, "header", "Selecione o publico alvo.", "");
                    res.status(400).send(errors);
                    return;
                }
            }

            //VALIDAR CAMPOS OBRIGATORIOS
            req.assert("numParticipantes").notEmpty().withMessage("Preencha o campo número de participantes.");
            req.assert("atividadeTipo").notEmpty().withMessage("Preencha o campo tipo de atividade.");


        }
        //else if (obj.tipoFicha == '9' || obj.tipoFicha == '8') { //Ficha de Atendimento Domiciliar E Ficha de Atendimento Odontologico Individual

          //  req.assert("tipoAtendimento").notEmpty().withMessage("Preencha o campo tipo de atendimento");
            
            //if (obj.modalidade == null) {
                //req.assert("modalidade").notEmpty().withMessage("Modalidade é um campo obrigatório;");
            //}

            // CAMPO = atencaoDomiciliarModalidade
            // Apenas as opções 1, 2 e 3 são aceitas;
            //if (obj.modalidade && obj.modalidade.length > 0 && obj.modalidade != '1' && obj.modalidade != '2' && obj.modalidade != '3') {
                //errors = util.customError(errors, "header","Apenas as modalidades AD1, AD2 e AD3 são aceitas para esse tipo de ficha." , "");
                //res.status(400).send(errors);
               // return;
            //}
        //}
        //else {
            // CAMPO = localDeAtendimento
            // 11, 12 e 13 Utilizado apenas na Ficha de Atendimento Domiciliar
            //if (obj.localDeAtendimento && (obj.localDeAtendimento == '11' || obj.localDeAtendimento == '12' || obj.localDeAtendimento == '13')) {
                //errors = util.customError(errors, "header", "Esse local de atendimento só é permitido para Ficha de atendimento domiciliar", "");
                //res.status(400).send(errors);
                //return;
            //}
        //}

        errors = req.validationErrors();

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

        const connection = await app.dao.connections.EatendConnection.connection();

        const atendimentoRepository = new app.dao.AtendimentoDAO(connection);
        const profissionalRepository = new app.dao.ProfissionalDAO(connection);
        const pacienteRepository = new app.dao.PacienteDAO(connection);
        const parametroSegurancaRepository = new app.dao.ParametroSegurancaDAO(connection);
        const tipoFichaRepository = new app.dao.TipoFichaDAO(connection);
        const participanteAtividadeColetivaRepository = new app.dao.AtendimentoParticipanteAtividadeColetivaDAO(connection);
        const profissionalAtividadeColetivaRepository = new app.dao.AtendimentoProfissionalAtividadeColetivaDAO(connection);

        try {
            console.log('Iniciando transacao do paciente: ' + obj.idPaciente + ', at: ' + new Date());
            await connection.beginTransaction();

            var buscaProfissional = await profissionalRepository.buscaProfissionalPorUsuarioSync(usuario.id);

            if (!buscaProfissional) {
                errors = util.customError(errors, "header", "O seu usuário não possui profissional vinculado, não é permitido criar/alterar atendimentos", "");
                res.status(400).send(errors);
                await connection.rollback();
                return;
            }

            obj.numParticipantes == '' ? obj.numParticipantes = 0 : obj.numParticipantes;
            obj.atividadeTipo == '' ? obj.atividadeTipo = 0 : obj.atividadeTipo;
            obj.procedimento == '' ? obj.procedimento = 0 : obj.procedimento;
            obj.praticasEmSaude == '' ? obj.praticasEmSaude = 0 : obj.praticasEmSaude;
            obj.pseEducacao == '' ? obj.pseEducacao = 0 : obj.pseEducacao;
            obj.pseSaude == '' ? obj.pseSaude = 0 : obj.pseSaude;
            obj.publicoAlvo == '' ? obj.publicoAlvo = 0 : obj.publicoAlvo;
            obj.temasParaSaude == '' ? obj.temasParaSaude = 0 : obj.temasParaSaude;
            obj.temasParaReuniao == '' ? obj.temasParaReuniao = 0 : obj.temasParaReuniao;

            obj.gestante == '' ? obj.gestante = 0 : obj.gestante;
            obj.possuiNecessidadesEspeciais == '' ? obj.possuiNecessidadesEspeciais = 0 : obj.possuiNecessidadesEspeciais;
            obj.tipoConsultaOdonto == '' ? obj.tipoConsultaOdonto = 0 : obj.tipoConsultaOdonto;

            objParticipanteAtividadeColetiva.idPaciente = obj.idPaciente;
            objParticipanteAtividadeColetiva.abandonouGrupo = !obj.abandonouGrupo ? false : obj.abandonouGrupo;
            objParticipanteAtividadeColetiva.avaliacaoAlterada = !obj.avaliacaoAlterada ? false : obj.avaliacaoAlterada;
            objParticipanteAtividadeColetiva.parouFumar = !obj.parouFumar ? false : obj.parouFumar;

            obj.modalidade == '' ? obj.modalidade = 0 : obj.modalidade;
            obj.tipoAtendimento == '' ? obj.tipoAtendimento = 0 : obj.tipoAtendimento;
            obj.vacinasEmDia == '' ? obj.vacinasEmDia = 0 : obj.vacinasEmDia;
            obj.condicaoAvaliada == '' ? obj.condicaoAvaliada = 0 : obj.condicaoAvaliada;

            delete obj.abandonouGrupo;
            delete obj.avaliacaoAlterada;
            delete obj.parouFumar;
            delete obj.tiposFornecimOdonto;
            delete obj.tiposConsultaOdonto;
            delete obj.tiposVigilanciaSaudeBucal;
            delete obj.condutaEncaminhamento;

            obj.dataCriacao = new Date(obj.dataCriacao);

            var responseAtendimento = await atendimentoRepository.salvaSync(obj);

            obj.id = responseAtendimento[0].insertId;
            console.log('Iniciando transacao do paciente: ' + obj.id + ', at: ' + new Date());

            objHistorico.idTipoAtendimentoHistorico = obj.situacao == "0" ? 4 : 1;
            objHistorico.textoHistorico = "";
            objHistorico.idAtendimento = obj.id;
            objHistorico.numParticipantes == '' ? objHistorico.numParticipantes = 0 : objHistorico.numParticipantes;
            objHistorico.atividadeTipo == '' ? objHistorico.atividadeTipo = 0 : objHistorico.atividadeTipo;
            objHistorico.procedimento == '' ? objHistorico.procedimento = 0 : objHistorico.procedimento;
            objHistorico.praticasEmSaude == '' ? objHistorico.praticasEmSaude = 0 : objHistorico.praticasEmSaude;
            objHistorico.pseEducacao == '' ? objHistorico.pseEducacao = 0 : objHistorico.pseEducacao;
            objHistorico.pseSaude == '' ? objHistorico.pseSaude = 0 : objHistorico.pseSaude;
            objHistorico.publicoAlvo == '' ? objHistorico.publicoAlvo = 0 : objHistorico.publicoAlvo;
            objHistorico.temasParaSaude == '' ? objHistorico.temasParaSaude = 0 : objHistorico.temasParaSaude;
            objHistorico.temasParaReuniao == '' ? objHistorico.temasParaReuniao = 0 : objHistorico.temasParaReuniao;
            objHistorico.modalidade == '' ? objHistorico.modalidade = 0 : objHistorico.modalidade;
            objHistorico.tipoAtendimento == '' ? objHistorico.tipoAtendimento = 0 : objHistorico.tipoAtendimento;
            objHistorico.vacinasEmDia == '' ? objHistorico.vacinasEmDia = 0 : objHistorico.vacinasEmDia;
            objHistorico.condicaoAvaliada == '' ? objHistorico.condicaoAvaliada = 0 : objHistorico.condicaoAvaliada;


            objHistorico.gestante == '' ? objHistorico.gestante = 0 : objHistorico.gestante;
            objHistorico.possuiNecessidadesEspeciais == '' ? objHistorico.possuiNecessidadesEspeciais = 0 : objHistorico.possuiNecessidadesEspeciais;
            objHistorico.tipoConsultaOdonto == '' ? objHistorico.tipoConsultaOdonto = 0 : objHistorico.tipoConsultaOdonto;

            delete objHistorico.id;
            delete objHistorico.abandonouGrupo;
            delete objHistorico.avaliacaoAlterada;
            delete objHistorico.parouFumar;
            delete objHistorico.tiposFornecimOdonto;
            delete objHistorico.tiposConsultaOdonto;
            delete objHistorico.tiposVigilanciaSaudeBucal;
            delete objHistorico.condutaEncaminhamento;

            objHistorico.dataCriacao = new Date(objHistorico.dataCriacao);

            var responseAtendimento = await atendimentoRepository.salvaHistoricoSync(objHistorico);

            obj.emailProfissional = buscaProfissional.email;

            let buscaChaves = "'URL_FICHA_DIGITAL_SERVICO','CONTA_EMAIL', 'SENHA_EMAIL'";

            var valorChave = await parametroSegurancaRepository.buscarValorPorChaveSync(buscaChaves);

            if (valorChave) {
                urlFicha = valorChave.filter((url) => url.NOME == "URL_FICHA_DIGITAL_SERVICO")[0].VALOR;
                emailRemetente = valorChave.filter((url) => url.NOME == "CONTA_EMAIL")[0].VALOR;
                senhaRemetente = valorChave.filter((url) => url.NOME == "SENHA_EMAIL")[0].VALOR;
            }

            var responseEmailPaciente = await pacienteRepository.buscaEmailPacienteSync(obj.idPaciente);

            if (responseEmailPaciente) {
                console.log(responseEmailPaciente.email);

                if (responseEmailPaciente[0].email != null) {
                    obj.email = responseEmailPaciente[0].email;
                }
            }

            var template = await tipoFichaRepository.buscaTemplatePorIdSync(obj.tipoFicha);

            //ATIVIDADE COLETIVA
            if (obj.tipoFicha == 7) {

                objParticipanteAtividadeColetiva.idAtendimento = obj.id;
                objProfissionalAtividadeColetiva.idAtendimento = obj.id;
                objProfissionalAtividadeColetiva.idProfissional = buscaProfissional.id;

                //PACIENTE SELECIONADO INICIAL
                var responseParticipanteAtividadeColetiva = await participanteAtividadeColetivaRepository.salvaSync(objParticipanteAtividadeColetiva);
                if (!responseParticipanteAtividadeColetiva) {
                    errors = util.customError(errors, "header", "Erro ao Inserir Participante Inicial atividade coletiva.", "");
                    res.status(400).send(errors);
                    await connection.rollback();
                    return;
                }

                //PROFISSIONAL DO ATENDIMENTO INICIAL
                var responseProfissionalAtividadeColetiva = await profissionalAtividadeColetivaRepository.salvaSync(objProfissionalAtividadeColetiva);
                if (!responseProfissionalAtividadeColetiva) {
                    errors = util.customError(errors, "header", "Erro ao Inserir Profissional Inicial atividade coletiva.", "");
                    res.status(400).send(errors);
                    await connection.rollback();
                    return;
                }

            }

            await connection.commit();
            console.log('Commit transacao do atendimento: ' + obj.id + ', at: ' + new Date());

            if (template.length) {

                if (template[0].queryTemplate && template[0].xmlTemplate) {

                    var dadosFicha = await atendimentoRepository.buscaDadosFichaAtendimentoSync(template[0].queryTemplate, obj.id);

                    if (dadosFicha && dadosFicha.length) {
                        obj.dadosFicha = dadosFicha[0];
                        console.log('Iniciando processo de envio da ficha: ' + obj.id + ', at: ' + new Date());
                        var client = new app.services.FichaDigitalService();
                        var envioFicha = await client.enviaFichaSync(dadosFicha[0], urlFicha, template[0].xmlTemplate);
                        console.log('Envio da ficha realizado: ' + obj.id + ', at: ' + new Date());
                    }
                }
            }

            res.status(201).send(obj);

        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado " + exception, ""));
            console.log('rollback transacao do atendimento: ' + obj.id + ', at: ' + new Date() + ', exception:' + exception);
            await connection.rollback();
        }
        finally {
            await connection.close();
        }
    });

    app.put('/atendimento', async function (req, res) {
        let usuario = req.usuario;
        let obj = req.body;
        let util = new app.util.Util();
        let errors = [];
        let id = obj.id;
        delete obj.id;
        delete obj.pacienteNome;
        delete obj.pesquisaCentral;
        delete obj.dataCriacao;
        obj.idUsuarioAlteracao = usuario.id;
        delete obj.idUsuario;
        obj.historiaProgressa = obj.pacienteHistoriaProgressa;
        var objHistorico = Object.assign({}, obj);
        objHistorico.idUsuario = usuario.id;
        delete obj.idTipoAtendimentoHistorico;
        delete obj.textoHistorico;

        req.assert("idPaciente").notEmpty().withMessage("Paciente um campo obrigatório;");
        req.assert("situacao").notEmpty().withMessage("Situação é um campo obrigatório;");
        req.assert("tipoFicha").notEmpty().withMessage("Tipo de ficha é um campo obrigatório;");
        req.assert("idClassificacaoRisco").notEmpty().withMessage("Classificação de risco é um campo obrigatório;");        
        req.assert("tipoAtendimento").notEmpty().withMessage("Tipo de atendimento é um campo obrigatório;");

        if (obj.tipoAtendimento && obj.tipoAtendimento == 0) {
            errors = util.customError(errors, "header", "Informe o Tipo de atendimento.", "");
            res.status(400).send(errors);
            return;
        }

        if (obj.situacao == "X")
            req.assert("motivoCancelamento").notEmpty().withMessage("Motivo do cancelamento é obrigatório;");

        if (obj.tipoFicha != 1 && obj.tipoFicha != 8){
            delete obj.idProfissionalCompartilhado;
            delete objHistorico.idProfissionalCompartilhado;
        }

        //ATIVIDADE COLETIVA
        if (obj.tipoFicha == 7) {

            // CAMPO = INEP
            // É de preenchimento obrigatório se pseEducacao = true ou pseSaude = true;
            if (obj.pseEducacao == true && obj.pseSaude == true && obj.inep == '') {
                errors = util.customError(errors, "header", "Informe o código Inep.", "");
                res.status(400).send(errors);
                return;
            }

            // CAMPO = atividadeTipo
            // 01 - Reunião de equipe;
            // 02 - Reunião com outras equipes de saúde;
            // 03 - Reunião intersetorial / Conselho local de saúde / Controle social;
            // 05 - Atendimento em grupo.
            //Não podem ser selecionados se pseEducacao = true e pseSaude = false
            if (obj.pseEducacao == true && obj.pseSaude == false) {
                if (obj.atividadeTipo == 1 || obj.atividadeTipo == 2 || obj.atividadeTipo == 3 || obj.atividadeTipo == 5) {
                    errors = util.customError(errors, "header", "Revisar o campo Tipo de Atividade não pode se pseEducacao marcado e pseSaude não marcado", "");
                    res.status(400).send(errors);
                    return;
                }
            }

            if (obj.atividadeTipo === 4 || obj.atividadeTipo === 5 || obj.atividadeTipo === 6 || obj.atividadeTipo === 7) {
                if (obj.publicoAlvo == 0 || obj.publicoAlvo == null) {
                    errors = util.customError(errors, "header", "Selecione o publico alvo.", "");
                    res.status(400).send(errors);
                    return;
                }
            }

            //VALIDAR CAMPOS OBRIGATORIOS
            req.assert("numParticipantes").notEmpty().withMessage("Preencha o campo numero de participantes.");
            req.assert("atividadeTipo").notEmpty().withMessage("Preencha o campo tipo de atividade.");

        }

        //ATENDIMENTO DOMICILIAR
        if (obj.tipoFicha == '9') {
            req.assert("tipoAtendimento").notEmpty().withMessage("Preencha o campo tipo de atendimento");

            if(obj.modalidade == undefined)
                obj.modalidade  = '';
             
            req.assert("modalidade").notEmpty().withMessage("Preencha o campo modalidade");

            // CAMPO = atencaoDomiciliarModalidade
            // Não pode ser preenchido se o campo tipoAtendimento = 9 - Visita domiciliar pós-óbito
            if (obj.tipoAtendimento && obj.tipoAtendimento == 9 && obj.modalidade && obj.modalidade > 0) {
                errors = util.customError(errors, "header", "Modalidade não pode ser preenchida para esse tipo de atendimento Visita domiciliar pós-óbito", "");
                res.status(400).send(errors);
                return;
            }

            // CAMPO = atencaoDomiciliarModalidade
            // Não pode ser preenchido se o campo tipoAtendimento = 9 - Visita domiciliar pós-óbito
            if (obj.modalidade && obj.modalidade > 3) {
                errors = util.customError(errors, "header", "Na Ficha de Atendimento Domiciliar só são permitidas as modalidades AD1, AD2 e AD3.", "");
                res.status(400).send(errors);
                return;
            }
        }

        //ATENDIMENTO ODONTOLOGICO
        if (obj.tipoFicha == '8') {
            req.assert("tipoAtendimento").notEmpty().withMessage("Preencha o campo tipo de atendimento");          
        }

        
        errors = req.validationErrors();

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        let medicamentos = [];
        let responsePorId = [];
        let receita = {};

        const connection = await app.dao.connections.EatendConnection.connection();

        const receitaRepository = new app.dao.ReceitaDAO(connection);
        const itemReceitaRepository = new app.dao.ItemReceitaDAO(connection);
        const profissionalRepository = new app.dao.ProfissionalDAO(connection);
        const pacienteRepository = new app.dao.PacienteDAO(connection);
        const atendimentoRepository = new app.dao.AtendimentoDAO(connection);
        const atendimentoMedicamentoRepository = new app.dao.AtendimentoMedicamentoDAO(connection);
        const atendimentoCondicaoAvaliadaRepository = new app.dao.AtendimentoCondicaoAvaliadaDAO(connection);
        
        try {

            await connection.beginTransaction();

            var atualizaPaciente = await pacienteRepository.atualizaHistoriaProgressaFamiliar(obj.pacienteHistoriaProgressa, obj.idPaciente, usuario.id, new Date());

            delete obj.pacienteHistoriaProgressa;
            delete objHistorico.pacienteHistoriaProgressa;

            var buscaProfissional = await profissionalRepository.buscaProfissionalPorUsuarioSync(usuario.id);

            if (!buscaProfissional) {
                errors = util.customError(errors, "header", "O seu usuário não possui profissional vinculado, não é permitido criar/alterar atendimentos", "");
                res.status(400).send(errors);
                await connection.rollback();
                return;
            }
            
            var buscaCondicaoAvaliadaAtendimento = await atendimentoCondicaoAvaliadaRepository.buscarPorAtendimentoId(id);

            //SE O USUARIO É ENFERMEIRO E NAO ENVIOU UM CONDICAO AVALIADA OBRIGAR O MESMO A SELECIONAR
            if ((usuario.idTipoUsuario == 9 || buscaProfissional.codigoCBO == '223505') && buscaCondicaoAvaliadaAtendimento.length == 0) {
                errors = util.customError(errors, "header", "É necessário informar a Avaliação/Classificação CIAP 2", "");
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
                receita.idAtendimento = id;
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
                receita.receitaExterna = 0;

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

            if (obj.situacao == "X")
                obj.dataCancelamento = new Date();
            else if (obj.situacao != "C" && obj.situacao != "0")
                obj.dataFinalizacao = new Date();

            obj.numParticipantes == '' ? obj.numParticipantes = 0 : obj.numParticipantes;
            obj.atividadeTipo == '' ? obj.atividadeTipo = 0 : obj.atividadeTipo;
            obj.procedimento == '' ? obj.procedimento = 0 : obj.procedimento;
            obj.praticasEmSaude == '' ? obj.praticasEmSaude = 0 : obj.praticasEmSaude;
            obj.pseEducacao == '' ? obj.pseEducacao = 0 : obj.pseEducacao;
            obj.pseSaude == '' ? obj.pseSaude = 0 : obj.pseSaude;
            obj.publicoAlvo == '' ? obj.publicoAlvo = 0 : obj.publicoAlvo;
            obj.temasParaSaude == '' ? obj.temasParaSaude = 0 : obj.temasParaSaude;
            obj.temasParaReuniao == '' ? obj.temasParaReuniao = 0 : obj.temasParaReuniao;
            obj.tipoHistoriaClinica == '' ? obj.tipoHistoriaClinica = 0 : obj.tipoHistoriaClinica;
            obj.ficouEmObservacao == '' ? obj.ficouEmObservacao = 0 : obj.ficouEmObservacao;
            obj.gestante == '' ? obj.gestante = 0 : obj.gestante;
            obj.possuiNecessidadesEspeciais == '' ? obj.possuiNecessidadesEspeciais = 0 : obj.possuiNecessidadesEspeciais;
            obj.tipoConsultaOdonto == '' ? obj.tipoConsultaOdonto = 0 : obj.tipoConsultaOdonto;
            obj.modalidade == '' ? obj.modalidade = 0 : obj.modalidade;
            obj.tipoAtendimento == '' ? obj.tipoAtendimento = 0 : obj.tipoAtendimento;
            obj.vacinasEmDia == '' ? obj.vacinasEmDia = 0 : obj.vacinasEmDia;
            obj.condicaoAvaliada == '' ? obj.condicaoAvaliada = 0 : obj.condicaoAvaliada;

            delete obj.abandonouGrupo;
            delete obj.avaliacaoAlterada;
            delete obj.parouFumar;
            delete obj.tiposFornecimOdonto;
            delete obj.tiposConsultaOdonto;
            delete obj.tiposVigilanciaSaudeBucal;


            var atualizaAtendimento = await atendimentoRepository.atualizaPorIdSync(obj, id);

            obj.id = id;
            obj.ano_receita = receita ? receita.ano : null;

            objHistorico.idTipoAtendimentoHistorico = obj.situacao == "0" ? "6" : obj.situacao == "C" ? 2 : "3";
            objHistorico.textoHistorico = "";
            objHistorico.idAtendimento = obj.id;
            delete objHistorico.id;

            objHistorico.numParticipantes == '' ? objHistorico.numParticipantes = 0 : objHistorico.numParticipantes;
            objHistorico.atividadeTipo == '' ? objHistorico.atividadeTipo = 0 : objHistorico.atividadeTipo;
            objHistorico.procedimento == '' ? objHistorico.procedimento = 0 : objHistorico.procedimento;
            objHistorico.praticasEmSaude == '' ? objHistorico.praticasEmSaude = 0 : objHistorico.praticasEmSaude;
            objHistorico.pseEducacao == '' ? objHistorico.pseEducacao = 0 : objHistorico.pseEducacao;
            objHistorico.pseSaude == '' ? objHistorico.pseSaude = 0 : objHistorico.pseSaude;
            objHistorico.publicoAlvo == '' ? objHistorico.publicoAlvo = 0 : objHistorico.publicoAlvo;
            objHistorico.temasParaSaude == '' ? objHistorico.temasParaSaude = 0 : objHistorico.temasParaSaude;
            objHistorico.temasParaReuniao == '' ? objHistorico.temasParaReuniao = 0 : objHistorico.temasParaReuniao;
            objHistorico.tipoHistoriaClinica == '' ? objHistorico.tipoHistoriaClinica = 0 : objHistorico.tipoHistoriaClinica;
            objHistorico.ficouEmObservacao == '' ? objHistorico.ficouEmObservacao = 0 : objHistorico.ficouEmObservacao;
            objHistorico.gestante == '' ? objHistorico.gestante = 0 : objHistorico.gestante;
            objHistorico.possuiNecessidadesEspeciais == '' ? objHistorico.possuiNecessidadesEspeciais = 0 : objHistorico.possuiNecessidadesEspeciais;
            objHistorico.tipoConsultaOdonto == '' ? objHistorico.tipoConsultaOdonto = 0 : objHistorico.tipoConsultaOdonto;
            objHistorico.modalidade == '' ? objHistorico.modalidade = 0 : objHistorico.modalidade;
            objHistorico.tipoAtendimento == '' ? objHistorico.tipoAtendimento = 0 : objHistorico.tipoAtendimento;
            objHistorico.vacinasEmDia == '' ? objHistorico.vacinasEmDia = 0 : objHistorico.vacinasEmDia;
            objHistorico.condicaoAvaliada == '' ? objHistorico.condicaoAvaliada = 0 : objHistorico.condicaoAvaliada;

            delete objHistorico.abandonouGrupo;
            delete objHistorico.avaliacaoAlterada;
            delete objHistorico.parouFumar;
            delete objHistorico.tiposFornecimOdonto;
            delete objHistorico.tiposConsultaOdonto;
            delete objHistorico.tiposVigilanciaSaudeBucal;

            var responseAtendimento = await atendimentoRepository.salvaHistoricoSync(objHistorico);

            res.status(201).send(obj);

            await connection.commit();
        }
        catch (exception) {
            console.log("Erro ao salvar o atendimento (" + id + "), exception: " + exception);
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));
            await connection.rollback();
        }
        finally {
            await connection.close();
        }
    });

    app.put('/atendimento/atribuir-atendimento', async function (req, res) {
        let usuario = req.usuario;
        let obj = req.body;
        let util = new app.util.Util();
        let errors = [];
        let id = obj.id;
        delete obj.id;
        delete obj.pacienteNome;
        delete obj.nome;
        delete obj.pesquisaCentral;
        obj.idUsuario = usuario.id;
        obj.idUsuarioAlteracao = usuario.id;
        obj.historiaProgressa = obj.pacienteHistoriaProgressa;
        var objHistorico = Object.assign({}, obj);
        objHistorico.idUsuario = usuario.id;
        delete obj.idTipoAtendimentoHistorico;
        delete obj.textoHistorico;

        delete obj.pacienteHistoriaProgressa;
        delete objHistorico.pacienteHistoriaProgressa;

        if (obj.tipoHistoriaClinica == '') {
            delete obj.tipoHistoriaClinica;
            delete objHistorico.tipoHistoriaClinica;
        }

        req.assert("idPaciente").notEmpty().withMessage("Paciente um campo obrigatório;");
        req.assert("situacao").notEmpty().withMessage("Situação é um campo obrigatório;");
        req.assert("tipoFicha").notEmpty().withMessage("Tipo de ficha é um campo obrigatório;");
        req.assert("idClassificacaoRisco").notEmpty().withMessage("Classificação de risco é um campo obrigatório;");
        req.assert("tipoAtendimento").notEmpty().withMessage("Tipo de atendimento é um campo obrigatório;");

        if (obj.situacao == "X")
            req.assert("motivoCancelamento").notEmpty().withMessage("Motivo do cancelamento é obrigatório;");

        errors = req.validationErrors();

        if (errors) {
            res.status(400).send(errors);
            return;
        }
        const connection = await app.dao.connections.EatendConnection.connection();

        const profissionalRepository = new app.dao.ProfissionalDAO(connection);
        const atendimentoRepository = new app.dao.AtendimentoDAO(connection);

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

            obj.situacao = 'C'; //Em aberto
            var atualizaAtendimento = await atendimentoRepository.atualizaPorIdSync(obj, id);

            objHistorico.idTipoAtendimentoHistorico = 5;
            objHistorico.textoHistorico = "";
            objHistorico.idAtendimento = id;
            delete objHistorico.id;

            var responseAtendimento = await atendimentoRepository.salvaHistoricoSync(objHistorico);

            res.status(201).send(obj);

            await connection.commit();
        }
        catch (exception) {
            console.log("Erro ao salvar o atendimento (" + id + "), exception: " + exception);
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));
            await connection.rollback();
        }
        finally {
            await connection.close();
        }
    });

    app.put('/atendimento/reabertura', async function (req, res) {
        let obj = req.body;
        let util = new app.util.Util();
        let errors = [];        

        req.assert("numero").notEmpty().withMessage("Preencha o campo com o(s) número(s) para reabertura");
        errors = req.validationErrors();

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        var ids = Object.assign([], obj.numero.split(","));
        delete obj.numero;
        const connection = await app.dao.connections.EatendConnection.connection();
        const atendimentoRepository = new app.dao.AtendimentoDAO(connection);
        
        try {

            await connection.beginTransaction();

            for (const idAtendimento of ids) {

                var buscaAtendimento = await atendimentoRepository.buscaPorIdSync(idAtendimento);
                if (buscaAtendimento) {                    
                    obj.situacao = 'C'; //Em aberto
                    obj.dataFinalizacao = null;
                    obj.dataCancelamento = null;

                    var atualizaAtendimento = await atendimentoRepository.atualizaPorIdSync(obj, idAtendimento);    
                }         
            }

            res.status(201).send(obj);

            await connection.commit();
        }
        catch (exception) {
            console.log("Erro ao salvar o atendimento (" + ids + "), exception: " + exception);
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));
            await connection.rollback();
        }
        finally {
            await connection.close();
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

    app.put('/atendimento/:id/finalizar', async function (req, res) {
        const atendimentoId = req.params.id;
        const body = req.body;
        let util = new app.util.Util();
        let errors = [];
        let obj = {};

        obj.situacao = body.situacao ? body.situacao : "2"; //Concluído

        if (obj.situacao == 'X')
            obj.dataCancelamento = body.dataCancelamento ? body.dataCancelamento : new Date();
        else
            obj.dataFinalizacao = body.dataFinalizacao ? body.dataFinalizacao : new Date();


        const connection = await app.dao.connections.EatendConnection.connection();

        const atendimentoRepository = new app.dao.AtendimentoDAO(connection);

        try {

            await connection.beginTransaction();

            var buscaAtendimento = await atendimentoRepository.buscaPorIdSync(atendimentoId);

            if (!buscaAtendimento) {
                errors = util.customError(errors, "header", "Atendimento não encontrado", atendimentoId);
                res.status(400).send(errors);
                await connection.rollback();
                return;
            }

            if (buscaAtendimento.dataFinalizacao || buscaAtendimento.dataCancelamento) {
                errors = util.customError(errors, "header", "Atendimento já foi finalizado/cancelado", atendimentoId);
                res.status(400).send(errors);
                await connection.rollback();
                return;
            }

            var objHistorico = Object.assign({}, buscaAtendimento);
            delete objHistorico.pacienteNome;
            delete objHistorico.pacienteHistoriaProgressa;
            delete objHistorico.pesquisaCentral;
            delete objHistorico.tipoHistoriaClinica;
            delete objHistorico.nome;
            delete objHistorico.historiaProgressaFamiliar;
            delete objHistorico.idMunicipioEstabelecimento;
            delete objHistorico.idUfEstabelecimento;

            if (obj.situacao == 'X') {
                obj.motivoCancelamento = "Cancelamento realizado pela ficha digital";
                objHistorico.motivoCancelamento = obj.motivoCancelamento;
                objHistorico.dataCancelamento = obj.dataCancelamento;
            } else {
                objHistorico.dataFinalizacao = obj.dataFinalizacao;
            }

            obj.idUsuarioAlteracao = buscaAtendimento.idUsuario;
            var atualizaAtendimento = await atendimentoRepository.atualizaPorIdSync(obj, atendimentoId);
            delete objHistorico.dataCriacao;
            delete objHistorico.id;
            objHistorico.idUsuarioAlteracao = buscaAtendimento.idUsuario;
            objHistorico.situacao = obj.situacao;
            objHistorico.idTipoAtendimentoHistorico = 7;
            objHistorico.textoHistorico = "";
            objHistorico.idAtendimento = atendimentoId;

            var responseAtendimento = await atendimentoRepository.salvaHistoricoSync(objHistorico);

            res.status(201).send('ok');

            await connection.commit();
        }
        catch (exception) {
            console.log("Erro ao salvar o atendimento (" + atendimentoId + "), exception: " + exception);
            errors = util.customError(errors, "data", "Erro ao salvar o atendimento (" + atendimentoId + "), exception: " + exception, "objs");
            res.status(500).send(errors);
            await connection.rollback();
        }
        finally {
            await connection.close();
        }
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

}