const connectionPool = require('../../ConnectionPool');

function createDBConnection() {
    return {
        async connection() {
            return await connectionPool.connection();
        }
    };
}

module.exports = function () {
    return createDBConnection();
}