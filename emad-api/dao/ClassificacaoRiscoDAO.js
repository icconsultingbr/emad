function ClassificacaoRiscoDAO(connection) {
    this._connection = connection;
    this._table = `tb_classificacao_risco`;
}

ClassificacaoRiscoDAO.prototype.salva = function(obj, callback) {
    this._connection.query(`INSERT INTO ${this._table} SET ?`, obj, callback);
}

ClassificacaoRiscoDAO.prototype.atualiza = function(obj, id, callback) {
    this._connection.query(`UPDATE ${this._table} SET ? WHERE id= ?`, [obj, id], callback);
}

ClassificacaoRiscoDAO.prototype.buscaPorId = function (id, callback) {
    this._connection.query(`SELECT * FROM ${this._table} WHERE id = ?`,id,callback);
}

ClassificacaoRiscoDAO.prototype.buscaDominio = function (callback) {
    this._connection.query(`SELECT id, nome FROM ${this._table} WHERE situacao = 1`, callback);
}

ClassificacaoRiscoDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}

ClassificacaoRiscoDAO.prototype.lista = function(callback) {   
    this._connection.query(`SELECT
                             a.id
                            ,a.idCorClassificacaoRisco
                            ,corClassificacaoRisco.nome nomeCorClassificacaoRisco
                            ,a.nome
                            ,a.situacao
                            FROM ${this._table} a
                            INNER JOIN tb_cor_classificacao_risco corClassificacaoRisco ON (a.idCorClassificacaoRisco = corClassificacaoRisco.id)
                            WHERE a.situacao = 1`, callback);
}
module.exports = function(){
    return ClassificacaoRiscoDAO;
};