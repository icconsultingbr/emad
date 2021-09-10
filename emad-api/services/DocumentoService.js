const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const path = require('path')
var config = require('config');
const { stringify } = require("querystring");

function DocumentoService() { }

DocumentoService.prototype.uploadImage = async function (file) {
    return new Promise((resolve, reject) => {
        try {
            if (!fs.existsSync(config.folderUploadExames)) {
                fs.mkdirSync(config.folderUploadExames);
            }
            var id = file.id.value;
            if (!id)
                id = uuidv4();

            let base64Image = file.base64.split(";base64,").pop();

            fs.writeFile(`${config.folderUploadExames}/${id}.${file.extension}`, base64Image, { encoding: "base64" }, function () {
                resolve(id + `.${file.extension}`);
            }, function (error) {
                reject('Erro ao criar arquivo:: ' + error)
            });
        } catch (e) {
            reject(e);
        }
    });
};

DocumentoService.prototype.uploadImageList = async function (file) {
    return new Promise((resolve, reject) => {
        try {

            var listAllImage = [];

            if (!fs.existsSync(config.folderUploadExames)) {
                fs.mkdirSync(config.folderUploadExames);
            }

            for (const itemfile of file) {
                var id = itemfile.id.value;
                if (!id)
                    id = uuidv4();

                let base64Image = itemfile.base64.split(";base64,").pop();

                var imagePro = {
                    caminho: `${config.folderUploadExames}/${id}.${itemfile.extension}`,
                    nome: "nome: " + id
                };

                listAllImage.push(imagePro)

                fs.writeFile(`${config.folderUploadExames}/${id}.${itemfile.extension}`, base64Image, { encoding: "base64" }, function () {
                    resolve(listAllImage);
                }, function (error) {
                    reject('Erro ao criar arquivo:: ' + error)
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = function () {
    return DocumentoService;
};
