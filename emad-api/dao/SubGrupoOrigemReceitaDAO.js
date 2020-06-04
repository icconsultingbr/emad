function SubGrupoOrigemReceitaDAO(connection) {
    this._connection = connection;
    this._table = `tb_sub_grupo_origem_receita`;
}

SubGrupoOrigemReceitaDAO.prototype.salva = function(obj, callback) {
    this._connection.query(`INSERT INTO ${this._table} SET ?`, obj, callback);
}

SubGrupoOrigemReceitaDAO.prototype.atualiza = function(obj, id, callback) {
    this._connection.query(`UPDATE ${this._table} SET ? WHERE id= ?`, [obj, id], callback);
}

SubGrupoOrigemReceitaDAO.prototype.buscaPorId = function (id, callback) {
    this._connection.query(`SELECT * FROM ${this._table} WHERE id = ?`,id,callback);
}

SubGrupoOrigemReceitaDAO.prototype.buscaDominio = function (callback) {
    this._connection.query(`SELECT id, nome FROM ${this._table} WHERE situacao = 1`, callback);
}

SubGrupoOrigemReceitaDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}

SubGrupoOrigemReceitaDAO.prototype.lista = function(callback) {   
    this._connection.query(`SELECT
                             a.id
                            ,a.idGrupoOrigemReceita
                            ,grupoOrigemReceita.nome nomeGrupoOrigemReceita
                            ,a.nome
                            ,a.exibirCidade
                            ,a.situacao
                            FROM ${this._table} a
                            INNER JOIN tb_grupo_origem_receita grupoOrigemReceita ON (a.idGrupoOrigemReceita = grupoOrigemReceita.id)
                            WHERE a.situacao = 1`, callback);
}
module.exports = function(){
    return SubGrupoOrigemReceitaDAO;
};