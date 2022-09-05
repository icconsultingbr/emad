function EstrategiaVacinacaoDAO(connection) {
    this._connection = connection;
    this._table = "tb_estrategia_vacinacao";
}

EstrategiaVacinacaoDAO.prototype.salva = function(obj, callback) {
    this._connection.query(`INSERT INTO ${this._table} SET ?`, obj, callback);
}

EstrategiaVacinacaoDAO.prototype.atualiza = function(obj, id, callback) {
    this._connection.query(`UPDATE ${this._table} SET ? WHERE id= ?`, [obj, id], callback);
}

EstrategiaVacinacaoDAO.prototype.lista = function(callback) {    
    this._connection.query(`SELECT codigoSus, descricao, situacao FROM ${this._table}  WHERE situacao = 1`,callback);    
}

EstrategiaVacinacaoDAO.prototype.buscaPorId = function (id, callback) {
    this._connection.query(`SELECT * FROM ${this._table} WHERE id = ?`,id,callback);
}

EstrategiaVacinacaoDAO.prototype.buscaDominio = function (callback) {
    this._connection.query(`SELECT codigoSus id, descricao nome FROM ${this._table}`, callback);
}

EstrategiaVacinacaoDAO.prototype.dominio = function(callback) {
    this._connection.query("select codigoSus id, descricao nome FROM "+this._table+" WHERE situacao = 1 ORDER BY codigoSus ASC",callback);
}

EstrategiaVacinacaoDAO.prototype.dominioPorId = function(id, callback) {
    this._connection.query("select distinct a.codigoSus id, a.descricao nome FROM "+this._table+" a inner join tb_regras_vacina regra on regra.codigoVacinaSus="+ id +" and regra.codigoEstrategiaVacinacaoSus = a.codigoSus WHERE a.situacao = 1 ORDER BY a.codigoSus ASC ",callback);
}

EstrategiaVacinacaoDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}

module.exports = function(){
    return EstrategiaVacinacaoDAO;
};