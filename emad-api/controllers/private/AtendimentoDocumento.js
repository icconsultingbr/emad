module.exports = function (app) {
    app.post('/atendimento-documento', async function (req, res) {
        let arquivoDocumento = req.body;
        let usuario = req.usuario;
        const util = new app.util.Util();

        let errors = [];

        const connection = await app.dao.connections.EatendConnection.connection();
        const repository = new app.dao.AtendimentoDocumentoDAO(connection);

        try {
            await connection.beginTransaction();

            for (const itemfile of arquivoDocumento) {
                itemfile.dataCriacao = new Date;
                itemfile.idUsuarioCriacao = usuario.id;
                itemfile.situacao = 1;
                var response = await repository.salva(itemfile);
            }

            res.status(201).send(response);
            await connection.commit();
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado, exception: " + exception, ""));
            await connection.rollback();
        }
        finally {
            await connection.close();
        }
    });

    app.get('/atendimento-documento/documento/:id', async function (req, res) {
        let util = new app.util.Util();
        let errors = [];
        let idAtendimento = req.params.id;
        let items = [];
        const connection = await app.dao.connections.EatendConnection.connection();

        const repository = new app.dao.AtendimentoDocumentoDAO(connection);

        try {

            items = await repository.buscaPorIdAtendimento(idAtendimento);

            for (const itemfile of items) {
                const fs = require('fs');
                if(fs.existsSync(itemfile.caminho)){
                    itemfile.base64 = fs.readFileSync(itemfile.caminho, { encoding: 'base64' });
                }   
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

        app.put('/atendimento-documento/atualiza/:id', async function (req, res) {
        let util = new app.util.Util();
        let errors = [];
        let idDocumento = req.params.id;
        let usuario = req.usuario.id;
        let documento = [];

        const connection = await app.dao.connections.EatendConnection.connection();
        const exameArquivosRepository = new app.dao.AtendimentoDocumentoDAO(connection);

        try {

            documento.idDocumento = idDocumento
            documento.idUsuarioAlteracao = usuario;
            documento.dataAlteracao = new Date();

            await exameArquivosRepository.atualiza(documento);
            res.status(200).send(documento);
            await connection.commit();
        }
        catch (exception) {
            res.status(500).send(util.customError(errors, "header", "Ocorreu um erro inesperado", ""));
        }
        finally {
            await connection.close();
        }
    });
};
