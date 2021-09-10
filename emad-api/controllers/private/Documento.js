module.exports = function (app) {

    app.post("/documento/image", async function (req, res) {
        var documento = new app.services.DocumentoService();
        var result = await documento.uploadImage(req.body);

        return res.status(201).send({ id: result });
    });

    app.post("/documentos/exame", async function (req, res) {
        var documento = new app.services.DocumentoService();
        var result = await documento.uploadImageList(req.body);

        return res.status(201).send(result);
    });
};
