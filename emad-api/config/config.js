const config = require('config');

module.exports = config.util.getEnv('NODE_CONFIG') !== '{}' ? JSON.parse(config.util.getEnv('NODE_CONFIG')) : {
    "urlApi": "http://localhost:4000",
    "apiPort": 4000,
    "consulta": 6,
    "superAdmin": 3,
    "avancado": 2,
    "admin": 1,
    "idUsuarioSistema": 1,
    "folderUpload": "/Users/dener.oliveira/uploads",
    "folderUploadExames": "c:/uploads",
    "dbConfig": {
        "host": "34.83.206.222",
        "port": 3306,
        "username": "root",
        "password": "zCAV%xf2",
        "database": "e-atend-al-dev"
    },
    "idUsuarioIntegracao": 53
}