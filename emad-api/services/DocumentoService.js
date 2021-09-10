const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const path = require('path')
var config = require('config');

function DocumentoService() { }

DocumentoService.prototype.uploadImage = async function (file) {
    return new Promise((resolve, reject) => {
        try {
            if (file.locate = "exame") {
                if (!fs.existsSync(config.folderUploadArquivos)) {
                    fs.mkdirSync(config.folderUploadArquivos);
                }
            } else {
                if (!fs.existsSync(config.folderUpload)) {
                    fs.mkdirSync(config.folderUpload);
                }
            }

            var id = file.id.value;
            if (!id)
                id = uuidv4();

            let base64Image = file.base64.split(";base64,").pop();

            fs.writeFile(`${config.folderUpload}/${id}.${file.extension}`, base64Image, { encoding: "base64" }, function () {
                resolve(id + `.${file.extension}`);
            }, function (error) {
                reject('Erro ao criar arquivo:: ' + error)
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = function () {
    return DocumentoService;
};
