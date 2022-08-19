const { v4: uuidv4 } = require('uuid');

module.exports = function (app) {

    app.post('/exame', async function (req, res) {
        let exame = req.body;
        delete exame.id;

        let usuario = req.usuario;
        const util = new app.util.Util();
        let errors = [];

        req.assert("idEstabelecimento").notEmpty().withMessage("O campo Estabelecimento é um campo obrigatório");
        req.assert("idTipoExame").notEmpty().withMessage("O campo Tipo de exame é um campo obrigatório");

        errors = req.validationErrors();

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        const connection = await app.dao.connections.EatendConnection.connection();

        const repository = new app.dao.ExameDAO(connection);
        const profissionalRepository = new app.dao.ProfissionalDAO(connection);

        try {
            await connection.beginTransaction();

            var buscaProfissional = await profissionalRepository.buscaProfissionalPorUsuarioSync(usuario.id);

            if (!buscaProfissional) {
                errors = util.customError(errors, "header", "O seu usuário não possui profissional vinculado, não é permitido criar/alterar exames", "");
                res.status(400).send(errors);
                await connection.rollback();
                return;
            }

            exame.dataCriacao = new Date;
            exame.idUsuarioCriacao = usuario.id;
            exame.situacao = 1;

            var response = await repository.salva(exame);

            exame.id = response[0].insertId;
            res.status(201).send(exame);
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

    app.put('/exame', async function (req, res) {
        let exame = req.body;
        let usuario = req.usuario;
        let util = new app.util.Util();
        let errors = [];
        let situacao = 1;//Aberto        
        const guid = uuidv4();
        let objHipotese = {};
        req.assert("idEstabelecimento").notEmpty().withMessage("O campo Estabelecimento é um campo obrigatório");
        //req.assert("idProfissional").notEmpty().withMessage("O campo Profissional é um campo obrigatório");
        req.assert("idPaciente").notEmpty().withMessage("O campo Paciente é um campo obrigatório");

        errors = req.validationErrors();

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        if (exame.itensExame.length == 0) {
            errors = util.customError(errors, "header", "Nenhum produto foi adicionado", "");
            res.status(400).send(errors);
            return;
        }

        if (exame.acao == 'F' && !exame.resultadoFinal) {
            errors = util.customError(errors, "header", "Para finalizar o exame preencha o campo Interpretação do resultado", "");
            res.status(400).send(errors);
            return;
        }

        const connection = await app.dao.connections.EatendConnection.connection();

        const exameRepository = new app.dao.ExameDAO(connection);
        const itemExameRepository = new app.dao.ItemExameDAO(connection);
        const tipoExameRepository = new app.dao.TipoExameDAO(connection);
        const atendimentoHipoteseRepository = new app.dao.AtendimentoHipoteseDiagnosticaDAO(connection);
        const profissionalRepository = new app.dao.ProfissionalDAO(connection);

        try {
            await connection.beginTransaction();

            var buscaProfissional = await profissionalRepository.buscaProfissionalPorUsuarioSync(usuario.id);

            if (!buscaProfissional) {
                errors = util.customError(errors, "header", "O seu usuário não possui profissional vinculado, não é permitido criar/alterar exames", "");
                res.status(400).send(errors);
                await connection.rollback();
                return;
            }

            //Gravar itens do exame
            for (const itemExame of exame.itensExame) {
                itemExame.situacao = 1;//FINALIZADO

                delete itemExame.nomeExame;
                delete itemExame.nomeProdutoExame;
                delete itemExame.nomeMetodoExame;
                delete itemExame.nomeResultado;

                itemExame.idExame = exame.id;
                itemExame.idUsuarioCriacao = usuario.id;
                itemExame.dataCriacao = new Date;

                if (itemExame.id) {
                    delete itemExame.dataCriacao;
                    delete itemExame.idUsuarioCriacao;
                    itemExame.dataAlteracao = new Date;
                    itemExame.idUsuarioAlteracao = usuario.id;
                    var item = await itemExameRepository.atualiza(itemExame);
                }
                else {
                    var responseItemExame = await itemExameRepository.salva(itemExame);
                    itemExame.id = responseItemExame[0].insertId;
                }
            }

            exame.resultado = exame.resultadoFinal;
            exame.dataAlteracao = new Date;
            exame.idUsuarioAlteracao = usuario.id;
            exame.situacao = (exame.acao == 'F' ? 2 : situacao);

            //Quando a interpretação do resultado for reagente, criar hipotese no paciente
            if (exame.situacao == '2' && exame.resultado == '2') {
                var responseBuscaHipotese = await tipoExameRepository.carregaHipotese(exame.idTipoExame);

                if (!responseBuscaHipotese.idHipoteseDiagnostica) {
                    errors = util.customError(errors, "header", "Nenhuma hipótese foi vinculada ao tipo de exame!", "");
                    res.status(400).send(errors);
                    await connection.rollback();
                    return;
                }

                objHipotese.idPaciente = exame.idPaciente;
                objHipotese.idExame = exame.id;
                objHipotese.idHipoteseDiagnostica = responseBuscaHipotese.idHipoteseDiagnostica;
                objHipotese.dataCriacao = new Date;
                objHipotese.idUsuarioCriacao = usuario.id;
                objHipotese.situacao = 1;
                objHipotese.idEstabelecimento = exame.idEstabelecimento;

                var responseHipotese = await atendimentoHipoteseRepository.salva(objHipotese);
                objHipotese.id = responseHipotese[0].insertId;
            }

            //atualiza o status do exame
            var responseExame = await exameRepository.atualizaStatus(exame);

            res.status(201).send(responseExame);

            await connection.commit();
        }
        catch (exception) {
            console.log("Erro ao salvar o exame (" + exame.id + "), exception: " + exception);
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));
            await connection.rollback();
        }
        finally {
            await connection.close();
        }
    });

    app.get('/exame/:id', async function (req, res) {
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        const connection = await app.dao.connections.EatendConnection.connection();

        const exameRepository = new app.dao.ExameDAO(connection);
        const itemExameRepository = new app.dao.ItemExameDAO(connection);

        try {

            var responseExame = await exameRepository.buscaPorId(id);
            var itensExame = await itemExameRepository.buscarPorExame(id);
            responseExame.itensExame = itensExame ? itensExame : null;

            res.status(200).json(responseExame);
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));
        }
        finally {
            await connection.close();
        }
    });

    app.get('/exame', async function (req, res) {
        let usuario = req.usuario;
        let util = new app.util.Util();
        let queryFilter = req.query;
        let errors = [];

        const connection = await app.dao.connections.EatendConnection.connection();

        try {
            const repository = new app.dao.ExameDAO(connection);
            const response = await repository.listar(queryFilter);
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

    app.get('/exame/prontuario-paciente/paciente/:idPaciente', async function (req, res) {
        let usuario = req.usuario;
        let id = req.params.idPaciente;
        let util = new app.util.Util();
        let errors = [];

        const connection = await app.dao.connections.EatendConnection.connection();

        const exameRepository = new app.dao.ExameDAO(connection);

        try {
            var response = await exameRepository.buscaPorPacienteId(id,0);
            res.status(200).json(response);
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado " + exception, ""));
        }
        finally {
            await connection.close();
        }
    });

    app.get('/exame/prontuario-vacinacao/paciente/:idPaciente', async function (req, res) {
        let usuario = req.usuario;
        let id = req.params.idPaciente;
        let util = new app.util.Util();
        let errors = [];

        const connection = await app.dao.connections.EatendConnection.connection();

        const receitaRepository = new app.dao.ReceitaDAO(connection);

        try {
            var response = await receitaRepository.buscaPorPacienteIdProntuarioVacinacao(id,0);
            res.status(200).json(response);
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado " + exception, ""));
        }
        finally {
            await connection.close();
        }
    });

    app.get('/exame/relatorio/:exameId', async function (req, res) {
        let id = req.params.exameId;
        let util = new app.util.Util();
        let errors = [];

        const connection = await app.dao.connections.EatendConnection.connection();
        const exameRepository = new app.dao.ExameDAO(connection);
        const tipoExameRepository = new app.dao.TipoExameDAO(connection);
        const pacienteRepository = new app.dao.PacienteDAO(connection);
        const estabelecimentoRepository = new app.dao.EstabelecimentoDAO(connection);
        const itensExameRepository = new app.dao.ItemExameDAO(connection);
        const profissionalRepository = new app.dao.ProfissionalDAO(connection)

        try {
            let exame = await exameRepository.buscaReportExameId(id);
            exame.tipoExame = await tipoExameRepository.buscaTipoExamePorId(exame.idTipoExame);
            let paciente = await pacienteRepository.buscaPorIdSync(exame.idPaciente);
            exame.paciente = paciente[0];
            exame.estabelecimento = await estabelecimentoRepository.carregaPorId(exame.idEstabelecimento);
            exame.itensExame = await itensExameRepository.buscarPorExame(id);
            exame.profissional = await profissionalRepository.buscaProfissionalPorUsuarioSync(exame.idUsuarioCriacao)
            res.status(200).json(exame);
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado " + exception, ""));
        }
        finally {
            await connection.close();
        }
    });

    app.get('/arquivo-exame/exame/:id', async function (req, res) {
        let util = new app.util.Util();
        let errors = [];
        let idExame = req.params.id;
        let items = [];
        const connection = await app.dao.connections.EatendConnection.connection();

        const exameArquivosRepository = new app.dao.ArquivosDAO(connection);

        try {

            items = await exameArquivosRepository.buscaPorId(idExame);

            for (const itemfile of items) {
                const fs = require('fs');
                itemfile.base64 = fs.readFileSync(itemfile.caminho, { encoding: 'base64' });
            }

            res.status(200).json(items);
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));
        }
        finally {
            await connection.close();
        }
    });

    app.put('/arquivo-exame/exame/:id', async function (req, res) {
        let util = new app.util.Util();
        let errors = [];
        let idExame = req.params.id;
        let usuario = req.usuario;
        let examedocumento = [];

        const connection = await app.dao.connections.EatendConnection.connection();
        const exameArquivosRepository = new app.dao.ArquivosDAO(connection);

        try {

            examedocumento.idExame = idExame
            examedocumento.idUsuarioAlteracao = usuario.id;
            examedocumento.dataAlteracao = new Date();

            await exameArquivosRepository.atualiza(examedocumento);
            res.status(200).send(examedocumento);
            await connection.commit();
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));
        }
        finally {
            await connection.close();
        }
    });

    app.post('/arquivo-exame', async function (req, res) {
        let exameDocumento = req.body;
        let usuario = req.usuario;
        const util = new app.util.Util();

        let errors = [];

        const connection = await app.dao.connections.EatendConnection.connection();
        const repository = new app.dao.ArquivosDAO(connection);

        try {
            await connection.beginTransaction();

            for (const itemfile of exameDocumento) {
                itemfile.dataCriacao = new Date;
                itemfile.idUsuarioCriacao = usuario.id;
                itemfile.situacao = 1;
                var response = await repository.salva(itemfile);
            }

            res.status(201).send(response);
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

}