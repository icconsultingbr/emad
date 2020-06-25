function SubgrupoOrigemDAO(connection) {
    this._connection = connection;
    this._table = `tb_subgrupo_origem`;
}

SubgrupoOrigemDAO.prototype.salva = function(obj, callback) {
    this._connection.query(`INSERT INTO ${this._table} SET ?`, obj, callback);
}

SubgrupoOrigemDAO.prototype.atualiza = function(obj, id, callback) {
    this._connection.query(`UPDATE ${this._table} SET ? WHERE id= ?`, [obj, id], callback);
}

SubgrupoOrigemDAO.prototype.buscaPorId = function (id, callback) {
    this._connection.query(`SELECT * FROM ${this._table} WHERE id = ?`,id,callback);
}

SubgrupoOrigemDAO.prototype.buscaDominio = function (callback) {
    this._connection.query(`SELECT id, nome FROM ${this._table} WHERE situacao = 1`, callback);
}

SubgrupoOrigemDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}

SubgrupoOrigemDAO.prototype.lista = function(callback) {   
    this._connection.query(`SELECT
                             a.id
                            ,a.idGrupoOrigem
                            ,grupoOrigem.nome nomeGrupoOrigem
                            ,a.nome
                            ,a.exibirCidade
                            ,a.situacao
                            FROM ${this._table} a
                            INNER JOIN tb_grupo_origem grupoOrigem ON (a.idGrupoOrigem = grupoOrigem.id)
                            WHERE a.situacao = 1`, callback);
}
module.exports = function(){
    return SubgrupoOrigemDAO;
};