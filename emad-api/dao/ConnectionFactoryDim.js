let mysql  = require('mysql');
let config = require('config');
let connection;

function createDBConnection(){


    if(!connection){
        connection = mysql.createConnection({
            host: config.dbConfigDim.host,
            user: config.dbConfigDim.username,
            password: config.dbConfigDim.password,
            database: config.dbConfigDim.database
        }); 
    }
    return connection;
}

module.exports = function() {
    return createDBConnection;
}