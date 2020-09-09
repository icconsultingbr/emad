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
        finally{
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
        finally{
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

            if(template.length){
                
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
        obj.idUsuario = usuario.id;
        obj.idUsuarioAlteracao = null;
        delete obj.idTipoAtendimentoHistorico;
        delete obj.textoHistorico;
        delete obj.tipoHistoriaClinica;
        var objHistorico = Object.assign({},obj);
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

        const connection = await app.dao.connections.EatendConnection.connection();

        const atendimentoRepository = new app.dao.AtendimentoDAO(connection);        
        const profissionalRepository = new app.dao.ProfissionalDAO(connection);        
        const pacienteRepository = new app.dao.PacienteDAO(connection);
        const parametroSegurancaRepository = new app.dao.ParametroSegurancaDAO(connection);
        const tipoFichaRepository = new app.dao.TipoFichaDAO(connection);

        try {
            await connection.beginTransaction();

            var buscaProfissional = await profissionalRepository.buscaProfissionalPorUsuarioSync(usuario.id);

            if (!buscaProfissional) {
                errors = util.customError(errors, "header", "O seu usuário não possui profissional vinculado, não é permitido criar/alterar atendimentos", "");
                 res.status(400).send(errors);
                await connection.rollback();
                return;
            }

            var responseAtendimento = await atendimentoRepository.salvaSync(obj);

            obj.id = responseAtendimento[0].insertId;
        
            objHistorico.idTipoAtendimentoHistorico = 1;
            objHistorico.textoHistorico = "";
            objHistorico.idAtendimento = obj.id;
            delete objHistorico.id;

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
                    
                    var teste = await mail.enviaEmailFicha(obj, emailRemetente, senhaRemetente, "Abertura de atendimento", "createTreatment.html");
                }
            }

            var template = await tipoFichaRepository.buscaTemplatePorIdSync(obj.tipoFicha);

            if(template.length){        

                 if (template[0].queryTemplate != null && template[0].xmlTemplate != null) {
                    
                     var dadosFicha = await atendimentoRepository.buscaDadosFichaAtendimentoSync(template[0].queryTemplate, obj.id);    
                    
                    if (dadosFicha && dadosFicha.length) {  
                        obj.dadosFicha = dadosFicha[0];            
                        var client = new app.services.FichaDigitalService();
                        var envioFicha = await client.enviaFichaSync(dadosFicha[0], urlFicha, template[0].xmlTemplate);                              
                     }
                }
            } 

            res.status(201).send(obj);

            await connection.commit();
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado " + exception, ""));
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
        obj.idUsuarioAlteracao = usuario.id;
        delete obj.idUsuario;
        obj.historiaProgressa = obj.pacienteHistoriaProgressa;
        var objHistorico = Object.assign({},obj);
        objHistorico.idUsuario = usuario.id;
        delete obj.idTipoAtendimentoHistorico;
        delete obj.textoHistorico;

        req.assert("idPaciente").notEmpty().withMessage("Paciente um campo obrigatório;");
        req.assert("situacao").notEmpty().withMessage("Situação é um campo obrigatório;");
        req.assert("tipoFicha").notEmpty().withMessage("Tipo de ficha é um campo obrigatório;");
        req.assert("idClassificacaoRisco").notEmpty().withMessage("Classificação de risco é um campo obrigatório;");

        if (obj.situacao == "X")
            req.assert("motivoCancelamento").notEmpty().withMessage("Motivo do cancelamento é obrigatório;");
        
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

            if(obj.situacao == "X")
                obj.dataCancelamento = new Date();
            else if(obj.situacao != "C")
                obj.dataFinalizacao = new Date();

            var atualizaAtendimento = await atendimentoRepository.atualizaPorIdSync(obj, id);

            obj.id = id;
            obj.ano_receita = receita ? receita.ano : null;
            
            objHistorico.idTipoAtendimentoHistorico = obj.situacao == "C" ? 2 : "3";
            objHistorico.textoHistorico = "";
            objHistorico.idAtendimento = obj.id;
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