function ParametroSegurancaDAO(connection) {
    this._connection = connection;
    this._table = "tb_parametro_seguranca";
}

ParametroSegurancaDAO.prototype.salva = function(obj, callback) {
    this._connection.query(`INSERT INTO ${this._table} SET ?`, obj, callback);
}

ParametroSegurancaDAO.prototype.atualiza = function(obj, id, callback) {
    this._connection.query(`UPDATE ${this._table} SET ? WHERE id= ?`, [obj, id], callback);
}

ParametroSegurancaDAO.prototype.lista = function(callback) {    
    this._connection.query(`SELECT id, nome, valor, observacao FROM ${this._table}  WHERE situacao = 1`,callback);    
}

ParametroSegurancaDAO.prototype.buscaPorId = function (id, callback) {
    this._connection.query(`SELECT * FROM ${this._table} WHERE id = ?`,id,callback);
}

ParametroSegurancaDAO.prototype.buscarValorPorChave = function (id, callback) {
    this._connection.query(`SELECT VALOR FROM ${this._table} WHERE CHAVE = ?`,id,callback);
}

ParametroSegurancaDAO.prototype.buscaDominio = function (callback) {
    this._connection.query(`SELECT id, nome FROM ${this._table}`, callback);
}

ParametroSegurancaDAO.prototype.dominio = function(callback) {
    this._connection.query("select id, nome FROM "+this._table+" WHERE situacao = 1 ORDER BY id ASC",callback);
}

ParametroSegurancaDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}

module.exports = function(){
    return ParametroSegurancaDAO;
};