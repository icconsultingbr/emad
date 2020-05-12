function TipoFichaDAO(connection) {
    this._connection = connection;
    this._table = "tb_tipo_ficha";
}

TipoFichaDAO.prototype.salva = function(obj, callback) {
    this._connection.query(`INSERT INTO ${this._table} SET ?`, obj, callback);
}

TipoFichaDAO.prototype.atualiza = function(obj, id, callback) {
    this._connection.query(`UPDATE ${this._table} SET ? WHERE id= ?`, [obj, id], callback);
}

TipoFichaDAO.prototype.lista = function(callback) {    
    this._connection.query(`SELECT id, nome, situacao FROM ${this._table}  WHERE situacao = 1`,callback);    
}

TipoFichaDAO.prototype.buscaPorId = function (id, callback) {
    this._connection.query(`SELECT * FROM ${this._table} WHERE id = ?`,id,callback);
}

TipoFichaDAO.prototype.buscaDominio = function (callback) {
    this._connection.query(`SELECT id, nome FROM ${this._table}`, callback);
}

TipoFichaDAO.prototype.dominio = function(callback) {
    this._connection.query("select id, nome FROM "+this._table+" WHERE situacao = 1 ORDER BY id ASC",callback);
}

TipoFichaDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}

module.exports = function(){
    return TipoFichaDAO;
};