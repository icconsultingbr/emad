module.exports = function (app) {
    app.post("/documento", async function (req, res) {
        var documento = new app.services.DocumentoService();
        var result = await documento.upload(req.body);

        return res.status(201).send({ id: result });
    });

    app.get("/documento/:id", async function (req, res) { });
};
