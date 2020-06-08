function FamiliaMaterialDAO(connection) {
    this._connection = connection;
    this._table = `tb_familia_material`;
}

FamiliaMaterialDAO.prototype.salva = function(obj, callback) {
    this._connection.query(`INSERT INTO ${this._table} SET ?`, obj, callback);
}

FamiliaMaterialDAO.prototype.atualiza = function(obj, id, callback) {
    this._connection.query(`UPDATE ${this._table} SET ? WHERE id= ?`, [obj, id], callback);
}

FamiliaMaterialDAO.prototype.buscaPorId = function (id, callback) {
    this._connection.query(`SELECT * FROM ${this._table} WHERE id = ?`,id,callback);
}

FamiliaMaterialDAO.prototype.buscaDominio = function (callback) {
    this._connection.query(`SELECT id, nome FROM ${this._table} WHERE situacao = 1`, callback);
}

FamiliaMaterialDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}

FamiliaMaterialDAO.prototype.lista = function(callback) {   
    this._connection.query(`SELECT
                             a.id
                            ,a.idGrupoMaterial
                            ,grupoMaterial.nome nomeGrupoMaterial
                            ,a.idSubGrupoMaterial
                            ,subGrupoMaterial.nome nomeSubGrupoMaterial
                            ,a.nome
                            ,a.situacao
                            FROM ${this._table} a
                            INNER JOIN tb_grupo_material grupoMaterial ON (a.idGrupoMaterial = grupoMaterial.id)
                            INNER JOIN tb_sub_grupo_material subGrupoMaterial ON (a.idSubGrupoMaterial = subGrupoMaterial.id)
                            WHERE a.situacao = 1`, callback);
}

FamiliaMaterialDAO.prototype.buscarPorSubGrupoMaterial = function (id, callback) {
    this._connection.query(`SELECT id, nome FROM ${this._table} WHERE idSubGrupoMaterial = ? and situacao = 1`,id,callback);
}

module.exports = function(){
    return FamiliaMaterialDAO;
};