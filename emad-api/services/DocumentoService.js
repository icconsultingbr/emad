const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const directory = `uploads`;

function DocumentoService() { }

DocumentoService.prototype.upload = async function (file) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory);
        }
        var id = uuidv4();

        let base64Image = file.base64.split(";base64,").pop();
        fs.writeFile(`${directory}/${id}.png`, base64Image, { encoding: "base64" }, function () {
            resolve(id);
        }, function (error) {
            reject('Erro ao criar arquivo:: ' + error)
        });
    });
};

DocumentoService.prototype.get = async function (id) {
    return new Promise((resolve, reject) => {

    });
}

module.exports = function () {
    return DocumentoService;
};
