function SubGrupoMaterialDAO(connection) {
    this._connection = connection;
    this._table = `tb_sub_grupo_material`;
}

SubGrupoMaterialDAO.prototype.salva = function(obj, callback) {
    this._connection.query(`INSERT INTO ${this._table} SET ?`, obj, callback);
}

SubGrupoMaterialDAO.prototype.atualiza = function(obj, id, callback) {
    this._connection.query(`UPDATE ${this._table} SET ? WHERE id= ?`, [obj, id], callback);
}

SubGrupoMaterialDAO.prototype.buscaPorId = function (id, callback) {
    this._connection.query(`SELECT * FROM ${this._table} WHERE id = ?`,id,callback);
}

SubGrupoMaterialDAO.prototype.buscaDominio = function (callback) {
    this._connection.query(`SELECT id, nome FROM ${this._table} WHERE situacao = 1`, callback);
}

SubGrupoMaterialDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}

SubGrupoMaterialDAO.prototype.lista = function(callback) {   
    this._connection.query(`SELECT
                             a.id
                            ,a.idGrupoMaterial
                            ,grupoMaterial.nome nomeGrupoMaterial
                            ,a.nome
                            ,a.situacao
                            FROM ${this._table} a
                            INNER JOIN tb_grupo_material grupoMaterial ON (a.idGrupoMaterial = grupoMaterial.id)
                            WHERE a.situacao = 1`, callback);
}
module.exports = function(){
    return SubGrupoMaterialDAO;
};