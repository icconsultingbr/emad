let mysql  = require('mysql');
const dim = require('../cache/DimCache');
let connection;

function createDBConnection(){
    if(connection){
        return connection;
    }

    let config = dim();
    let dimConnection = new config();

    connection = mysql.createConnection({
        host: dimConnection.host,
        user: dimConnection.username,
        password: dimConnection.password,
        database: dimConnection.database
    }); 
    
    return connection;
}

module.exports = function() {
    return createDBConnection;
}