function DoseVacinaDAO(connection) {
    this._connection = connection;
    this._table = "tb_dose_vacina";
}

DoseVacinaDAO.prototype.salva = function(obj, callback) {
    this._connection.query(`INSERT INTO ${this._table} SET ?`, obj, callback);
}

DoseVacinaDAO.prototype.atualiza = function(obj, id, callback) {
    this._connection.query(`UPDATE ${this._table} SET ? WHERE id= ?`, [obj, id], callback);
}

DoseVacinaDAO.prototype.lista = function(callback) {    
    this._connection.query(`SELECT codigoSus, descricao, situacao FROM ${this._table}  WHERE situacao = 1`,callback);    
}

DoseVacinaDAO.prototype.buscaPorId = function (id, callback) {
    this._connection.query(`SELECT * FROM ${this._table} WHERE id = ?`,id,callback);
}

DoseVacinaDAO.prototype.buscaDominio = function (callback) {
    this._connection.query(`SELECT codigoSus id, descricao nome FROM ${this._table}`, callback);
}

DoseVacinaDAO.prototype.dominio = function(callback) {
    this._connection.query("select codigoSus id, descricao nome FROM "+this._table+" WHERE situacao = 1 ORDER BY codigoSus ASC",callback);
}

DoseVacinaDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}

module.exports = function(){
    return DoseVacinaDAO;
};