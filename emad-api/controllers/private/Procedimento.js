module.exports = function (app) {

    app.get('/procedimento', async function (req, res) {
        let util = new app.util.Util();
        let queryFilter = req.query;
        let errors = [];

        const connection = await app.dao.connections.EatendConnection.connection();
        const procedimentoRepository = new app.dao.ProcedimentoDAO(connection);

        try {
            let response = await procedimentoRepository.lista(queryFilter);
            res.status(200).json(response);
        } catch (error) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));
        } finally {
            await connection.close();
        }

    });

    app.get('/procedimento/:id', async function (req, res) {
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        const connection = await app.dao.connections.EatendConnection.connection();
        const procedimentoRepository = new app.dao.ProcedimentoDAO(connection);

        try {
            let response = await procedimentoRepository.buscaPorId(id);
            res.status(200).json(response);
        } catch (error) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));
        } finally {
            await connection.close();
        }
    });

    app.get('/procedimento-tipo-ficha/:id', async function (req, res) {
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        const connection = await app.dao.connections.EatendConnection.connection();
        const procedimentoRepository = new app.dao.ProcedimentoDAO(connection);

        try {
            let response = await procedimentoRepository.buscaPorIdTipoFicha(id);
            res.status(200).json(response);
        } catch (error) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));
        } finally {
            await connection.close();
        }
    });

    app.post('/procedimento', async function (req, res) {
        var obj = req.body;
        var usuario = req.usuario;
        var util = new app.util.Util();
        var errors = [];

        const connection = await app.dao.connections.EatendConnection.connection();
        const procedimentoRepository = new app.dao.ProcedimentoDAO(connection);

        try {

            await connection.beginTransaction();

            let response = await procedimentoRepository.salva(obj);

            res.status(201).send(obj);

            await connection.commit();
        }
        catch (exception) {
            console.log("Erro ao salvar o procedimento (" + obj.nome + "), exception: " + exception);
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));
            await connection.rollback();
        }
        finally {
            await connection.close();
        }

    });

    app.put('/procedimento', async function (req, res) {
        let obj = req.body;
        let util = new app.util.Util();
        let errors = [];
        let id = obj.id;

        const connection = await app.dao.connections.EatendConnection.connection();
        const procedimentoRepository = new app.dao.ProcedimentoDAO(connection);

        try {

            await connection.beginTransaction();

            let response = await procedimentoRepository.atualiza(obj, id);

            res.status(201).send(obj);

            await connection.commit();
        }
        catch (exception) {
            console.log("Erro ao salvar o profissional (" + obj.nome + "), exception: " + exception);
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));
            await connection.rollback();
        }
        finally {
            await connection.close();
        }
    });

    app.delete('/procedimento/:id', async function (req, res) {
        var util = new app.util.Util();
        let errors = [];
        let id = req.params.id;

        const connection = await app.dao.connections.EatendConnection.connection();
        const procedimentoRepository = new app.dao.ProcedimentoDAO(connection);

        try {

            await connection.beginTransaction();

            let response = await procedimentoRepository.deletaPorId(id);

            res.status(201).send(obj);

            await connection.commit();
        }
        catch (exception) {
            console.log("Erro ao deletar o procedimento exception: " + exception);
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));
            await connection.rollback();
        }
        finally {
            await connection.close();
        }
    });
}