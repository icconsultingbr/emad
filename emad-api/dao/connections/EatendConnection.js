const util = require('util');
const mysql = require('mysql');
const config = require('config');

function createDBConnection() {
    const configuration = {
        host: config.dbConfig.host,
        user: config.dbConfig.username,
        password: config.dbConfig.password,
        database: config.dbConfig.database
    };

    const connection = mysql.createConnection(configuration);

    return {
        query(sql, args) {
            return util.promisify(connection.query)
                .call(connection, sql, args);
        },
        close() {
            return util.promisify(connection.end).call(connection);
        },
        beginTransaction() {
            return util.promisify(connection.beginTransaction)
                .call(connection);
        },
        commit() {
            return util.promisify(connection.commit)
                .call(connection);
        },
        rollback() {
            return util.promisify(connection.rollback)
                .call(connection);
        }
    };
}

module.exports = function () {
    return createDBConnection;
}