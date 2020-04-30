function ModeloCanetaDAO(connection) {
    this._connection = connection;
    this._table = "tb_modelo_caneta";
}

ModeloCanetaDAO.prototype.lista = function(addFilter, callback) {
    
    this._connection.query(`SELECT id, nome FROM ${this._table}`,callback);    
}

ModeloCanetaDAO.prototype.buscaPorId = function (id, callback) {
    this._connection.query(`SELECT * FROM ${this._table} WHERE id = ?`,id,callback);
}

ModeloCanetaDAO.prototype.buscaDominio = function (callback) {
    this._connection.query(`SELECT id, nome FROM ${this._table}`, callback);
}

ModeloCanetaDAO.prototype.dominio = function(callback) {
    this._connection.query("select id, nome FROM "+this._table+" WHERE situacao = 1 ORDER BY id ASC",callback);
}

module.exports = function(){
    return ModeloCanetaDAO;
};