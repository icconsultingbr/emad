module.exports = function (app) {

    const _table = "tb_atendimento_procedimento";

    app.post('/atendimento-procedimento', async function (req, res) {
        let obj = req.body;
        let usuario = req.usuario;
        let util = new app.util.Util();
        let errors = [];

        req.assert("idPaciente").notEmpty().withMessage("Paciente é campo Obrigatório");
        req.assert("idProcedimento").notEmpty().withMessage("Procedimento é um campo Obrigatório");

        errors = req.validationErrors();

        if (errors) {
            res.status(400).send(errors);
            return;
        }

        const connection = await app.dao.connections.EatendConnection.connection();

        const atendimentoProcedimentoRepository = new app.dao.AtendimentoProcedimentoDAO(connection);

        try {
            await connection.beginTransaction();

            if (obj.funcionalidade == 'PACIENTE') {
                var responseBuscaProcedimento = await atendimentoProcedimentoRepository.validaProcedimentoPorPaciente(obj);

                if (responseBuscaProcedimento.length > 0) {
                    errors = util.customError(errors, "header", "Procedimento já está vinculado ao paciente!", "");
                    res.status(400).send(errors);
                    await connection.rollback();
                    return;
                }
            }

            delete obj.funcionalidade;
            obj.dataCriacao = new Date;
            obj.idUsuarioCriacao = usuario.id;
            obj.situacao = 1;

            var response = await atendimentoProcedimentoRepository.salva(obj);
            obj.id = response[0].insertId;

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

    app.get('/atendimento-procedimento/atendimento/:id', async function (req, res) {
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        const connection = await app.dao.connections.EatendConnection.connection();

        try {
            const atendimentoProcedimentoRepository = new app.dao.AtendimentoProcedimentoDAO(connection);
            const response = await atendimentoProcedimentoRepository.buscarPorAtendimentoId(id);
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

    app.get('/atendimento-procedimento/tipo-ficha/:id', async function (req, res) {
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        const connection = await app.dao.connections.EatendConnection.connection();

        try {
            const tipoFichaatendimento = new app.dao.EstabelecimentoDAO(connection);
            const response = await tipoFichaatendimento.buscarTipoFichaEstabelecimento(id);
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

    app.get('/atendimento-procedimento/paciente/:id', async function (req, res) {
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        const connection = await app.dao.connections.EatendConnection.connection();

        try {
            const atendimentoProcedimentoRepository = new app.dao.AtendimentoProcedimentoDAO(connection);
            const response = await atendimentoProcedimentoRepository.listarPorPaciente(id);
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

    app.get('/atendimento-procedimento/paciente-agrupado/:id', async function (req, res) {
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        const connection = await app.dao.connections.EatendConnection.connection();

        try {
            const atendimentoProcedimentoRepository = new app.dao.AtendimentoProcedimentoDAO(connection);
            const response = await atendimentoProcedimentoRepository.listarPorPacienteAgrupada(id);
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

    app.delete('/atendimento-procedimento/:id', async function (req, res) {
        let util = new app.util.Util();
        let usuario = req.usuario;
        let errors = [];
        let id = req.params.id;
        let obj = {};
        obj.id = id;

        const connection = await app.dao.connections.EatendConnection.connection();

        const atendimentoProcedimentoRepository = new app.dao.AtendimentoProcedimentoDAO(connection);

        try {
            await connection.beginTransaction();

            obj.dataAlteracao = new Date;
            obj.idUsuarioAlteracao = usuario.id;
            obj.situacao = 0;

            var response = await atendimentoProcedimentoRepository.deletaPorId(obj);

            res.status(201).send(response);

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
}

