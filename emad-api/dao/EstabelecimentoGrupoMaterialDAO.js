function EstabelecimentoGrupoMaterialDAO(connection) {
    this._connection = connection;
    this._table = `tb_estabelecimento_grupo_material`;
}

EstabelecimentoGrupoMaterialDAO.prototype.salva = function(obj, callback) {
    this._connection.query(`INSERT INTO ${this._table} SET ?`, obj, callback);
}

EstabelecimentoGrupoMaterialDAO.prototype.atualiza = function(obj, id, callback) {
    this._connection.query(`UPDATE ${this._table} SET ? WHERE id= ?`, [obj, id], callback);
}

EstabelecimentoGrupoMaterialDAO.prototype.buscaPorId = function (id, callback) {
    this._connection.query(`SELECT * FROM ${this._table} WHERE id = ?`,id,callback);
}

EstabelecimentoGrupoMaterialDAO.prototype.buscaDominio = function (callback) {
    this._connection.query(`SELECT id, nome FROM ${this._table} WHERE situacao = 1`, callback);
}

EstabelecimentoGrupoMaterialDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}

EstabelecimentoGrupoMaterialDAO.prototype.lista = function(addFilter, callback) {   
    let where = "";

    if (addFilter.idEstabelecimento) {
        where+=" AND a.idEstabelecimento  = "+addFilter.idEstabelecimento;
    }

    this._connection.query(`SELECT
                             a.id
                            ,a.idEstabelecimento
                            ,estabelecimento.nomeFantasia nomeEstabelecimento
                            ,a.idGrupoMaterial
                            ,grupoMaterial.nome nomeGrupoMaterial
                            ,a.principal
                            ,a.situacao
                            FROM ${this._table} a
                            INNER JOIN tb_estabelecimento estabelecimento ON (a.idEstabelecimento = estabelecimento.id)
                            INNER JOIN tb_grupo_material grupoMaterial ON (a.idGrupoMaterial = grupoMaterial.id)
                            WHERE a.situacao = 1  ${where}`, callback);
}
module.exports = function(){
    return EstabelecimentoGrupoMaterialDAO;
};