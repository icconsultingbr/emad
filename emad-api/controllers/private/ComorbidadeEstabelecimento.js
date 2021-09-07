const { v4: uuidv4 } = require('uuid');

module.exports = function (app) {

    app.get('/comorbidade-estabelecimento/estabelecimento/:idEstabelecimento', async function (req, res) {

        let idEstabelecimento = req.params.idEstabelecimento;
        let util = new app.util.Util();
        let errors = [];
        let addFilter = req.query;

        const connection = await app.dao.connections.EatendConnection.connection();

        const ComorbidadeEstabelecimentoRespository = new app.dao.ComorbidadeEstabelecimentoDAO(connection);

        try {
            var responseComorbidadeEstabelecimento = await ComorbidadeEstabelecimentoRespository.lista(idEstabelecimento, addFilter);
            res.status(200).json(responseComorbidadeEstabelecimento);
        }
        catch (exception) {
            console.log("Erro ao carregar o registro, exception: " + exception);
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));
        }
        finally {
            await connection.close();
        }
    });

}