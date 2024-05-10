let mysql = require('mysql');
let config = require('../config/config');

let connection;

function createDBConnection() {
    if (!connection) {
        connection = mysql.createConnection({
            host: config.dbConfig.host,
            user: config.dbConfig.username,
            password: config.dbConfig.password,
            database: config.dbConfig.database,
        });
    }
    return connection;
}

module.exports = function () {
    return createDBConnection;
}