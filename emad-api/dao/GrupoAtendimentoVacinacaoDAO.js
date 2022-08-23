function GrupoAtendimentoVacinacaoDAO(connection) {
    this._connection = connection;
    this._table = "tb_grupo_atendimento_vacinacao";
}

GrupoAtendimentoVacinacaoDAO.prototype.salva = function(obj, callback) {
    this._connection.query(`INSERT INTO ${this._table} SET ?`, obj, callback);
}

GrupoAtendimentoVacinacaoDAO.prototype.atualiza = function(obj, id, callback) {
    this._connection.query(`UPDATE ${this._table} SET ? WHERE id= ?`, [obj, id], callback);
}

GrupoAtendimentoVacinacaoDAO.prototype.lista = function(callback) {    
    this._connection.query(`SELECT codigoSipni, descricao, situacao FROM ${this._table}  WHERE situacao = 1`,callback);    
}

GrupoAtendimentoVacinacaoDAO.prototype.buscaPorId = function (id, callback) {
    this._connection.query(`SELECT * FROM ${this._table} WHERE id = ?`,id,callback);
}

GrupoAtendimentoVacinacaoDAO.prototype.buscaDominio = function (callback) {
    this._connection.query(`SELECT codigoSipni id, descricao nome FROM ${this._table}`, callback);
}

GrupoAtendimentoVacinacaoDAO.prototype.dominio = function(callback) {
    this._connection.query("select codigoSipni id, descricao nome FROM "+this._table+" WHERE situacao = 1 ORDER BY descricao ASC",callback);
}

GrupoAtendimentoVacinacaoDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}

module.exports = function(){
    return GrupoAtendimentoVacinacaoDAO;
};