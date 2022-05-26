module.exports = function (app) {

    app.get('/condicaoAvaliada', async function (req, res) {
        let util = new app.util.Util();
        let queryFilter = req.query;
        let errors = [];

        const connection = await app.dao.connections.EatendConnection.connection();
        const condicaoAvaliadaRepository = new app.dao.CondicaoAvaliadaDAO(connection);

        try {
            let response = await condicaoAvaliadaRepository.lista(queryFilter);
            res.status(200).json(response);
        } catch (error) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));
        } finally {
            await connection.close();
        }

    });

    app.get('/atendimento-condicao-avaliada/atendimento/:id', async function (req, res) {
        let id = req.params.id;
        let util = new app.util.Util();
        let errors = [];

        const connection = await app.dao.connections.EatendConnection.connection();

        try {
            const atendimentoCondicaoAvaliadaRepository = new app.dao.AtendimentoCondicaoAvaliadaDAO(connection);
            const response = await atendimentoCondicaoAvaliadaRepository.buscarPorAtendimentoId(id);
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


    app.post('/atendimento-condicao-avaliada', async function (req, res) {
        var obj = req.body;
        var util = new app.util.Util();
        var errors = [];

        const connection = await app.dao.connections.EatendConnection.connection();
        const atendimentoCondicaoAvaliadaRepository = new app.dao.AtendimentoCondicaoAvaliadaDAO(connection);
        const atendimentoRepository = new app.dao.AtendimentoDAO(connection);

        try {            

            var buscaAtendimento = await atendimentoRepository.buscaPorIdSync(obj.idAtendimento);
            
             // CAMPO = condicoesAvaliadas
            // Não pode ser preenchido se o campo tipoAtendimento = 9 - Visita domiciliar pós-óbito;
            if (buscaAtendimento.tipoAtendimento && buscaAtendimento.tipoAtendimento == '9') {
                errors = util.customError(errors, "header", "Não pode inserir condições avaliadas se o tipo de atendimento é Não pode ser preenchido se o campo tipoAtendimento é Visita domiciliar pós-óbito", "");
                res.status(400).send(errors);
                return;
            }

            await connection.beginTransaction();

            let response = await atendimentoCondicaoAvaliadaRepository.salva(obj);

            res.status(201).send(obj);

            await connection.commit();
        }
        catch (exception) {
            console.log("Erro ao salvar o Condicao Avaliada (" + obj.nome + "), exception: " + exception);
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));
            await connection.rollback();
        }
        finally {
            await connection.close();
        }

    });

    app.put('/condicaoAvaliada', async function (req, res) {
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

    app.delete('/atendimento-condicao-avaliada/:id', async function (req, res) {
        var util = new app.util.Util();
        let errors = [];
        let id = req.params.id;
        let obj = {};
        obj.id = id;

        const connection = await app.dao.connections.EatendConnection.connection();
        const atendimentoCondicaoAvaliadaRepository = new app.dao.AtendimentoCondicaoAvaliadaDAO(connection);

        try {

            await connection.beginTransaction();

            await atendimentoCondicaoAvaliadaRepository.deletaPorId(id, res).then(function (response) {
                res.status(200).json(obj);
                return;
            });

            await connection.commit();
        }
        catch (exception) {
            console.log("Erro ao deletar a condição avaliada exception: " + exception);
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));
            await connection.rollback();
        }
        finally {
            await connection.close();
        }
    });
}