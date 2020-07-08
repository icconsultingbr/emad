const mysql = require("mysql");
const config = require('config');

let dbConfig = {
    connectionLimit: 5, // default 10
    host: config.dbConfig.host,
    user: config.dbConfig.username,
    password: config.dbConfig.password,
    database: config.dbConfig.database,
    acquireTimeout: 1000000,

};

const pool = mysql.createPool(dbConfig);
const connection = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) reject(err);

            console.log("MySQL pool connected: threadId " + connection.threadId);
            
            const query = (sql, binding) => {
                return new Promise((resolve, reject) => {
                    connection.query(sql, binding, (err, result) => {
                        if (err) reject(err);
                        resolve(result);
                    });
                });
            };
            const close = () => {
                return new Promise((resolve, reject) => {
                    if (err) reject(err);
                    console.log("MySQL pool released: threadId " + connection.threadId);
                    resolve(connection.release());
                });
            };

            const beginTransaction = () => {
                ;
                return new Promise((resolve, reject) => {
                    if (err) reject(err);
                    console.log("MySQL pool released: threadId " + connection.threadId);
                    resolve(connection.beginTransaction());
                });
            };

            const commit = () => {
                return new Promise((resolve, reject) => {
                    if (err) reject(err);
                    console.log("MySQL pool released: threadId " + connection.threadId);
                    resolve(connection.commit());
                });
            };

            const rollback = () => {
                return new Promise((resolve, reject) => {
                    if (err) reject(err);
                    console.log("MySQL pool released: threadId " + connection.threadId);
                    resolve(connection.rollback());
                });
            };

            resolve({ query, close, beginTransaction, commit, rollback });
        });
    });
};
const query = (sql, binding) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, binding, (err, result, fields) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

module.exports = { pool, connection, query };