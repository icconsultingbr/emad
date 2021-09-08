module.exports = function (app) {

    app.post('/atendimento-vacina', async function (req, res) {
        let obj = req.body;
        let usuario = req.usuario;
        let util = new app.util.Util();
        let errors = [];

        const connection = await app.dao.connections.EatendConnection.connection();

        const atendimentoVacinaRepository = new app.dao.AtendimentoVacinaDAO(connection);

        try {
            await connection.beginTransaction();
           
            obj.idUsuarioCriacao = usuario.id;
            obj.dataCriacao = new Date;
            obj.situacao = 1;

            var response = await atendimentoVacinaRepository.salva(obj);
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

    app.get('/atendimento-vacina/atendimento/:id', async function (req, res) {
        let usuario = req.usuario;
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        const connection = await app.dao.connections.EatendConnection.connection();

        try {
            const atendimentoVacinaRepository = new app.dao.AtendimentoVacinaDAO(connection);
            const response = await atendimentoVacinaRepository.buscarPorAtendimentoId(id);
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

    app.delete('/atendimento-vacina/:id', async function (req, res) {
        let util = new app.util.Util();
        let usuario = req.usuario;
        let errors = [];
        let id = req.params.id;
        let obj = {};
        obj.id = id;

        const connection = await app.dao.connections.EatendConnection.connection();

        const atendimentoVacinaRepository = new app.dao.AtendimentoVacinaDAO(connection);

        try {
            await connection.beginTransaction();

            obj.dataAlteracao = new Date;
            obj.idUsuarioAlteracao = usuario.id;
            obj.situacao = 0;

            var response = await atendimentoVacinaRepository.deletaPorId(obj);

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

