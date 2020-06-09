function EspecialidadeMaterialDAO(connection) {
    this._connection = connection;
    this._table = `tb_especialidade_material`;
}

EspecialidadeMaterialDAO.prototype.salva = function(obj, callback) {
    this._connection.query(`INSERT INTO ${this._table} SET ?`, obj, callback);
}

EspecialidadeMaterialDAO.prototype.atualiza = function(obj, id, callback) {
    this._connection.query(`UPDATE ${this._table} SET ? WHERE id= ?`, [obj, id], callback);
}

EspecialidadeMaterialDAO.prototype.buscaPorId = function (id, callback) {
    this._connection.query(`SELECT * FROM ${this._table} WHERE id = ?`,id,callback);
}

EspecialidadeMaterialDAO.prototype.buscaDominio = function (callback) {
    this._connection.query(`SELECT id, nome FROM ${this._table} WHERE situacao = 1`, callback);
}

EspecialidadeMaterialDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}

EspecialidadeMaterialDAO.prototype.lista = function(callback) {   
    this._connection.query(`SELECT
                             a.id
                            ,a.idEspecialidade
                            ,especialidade.nome nomeEspecialidade
                            ,a.idMaterial
                            ,material.descricao nomeMaterial
                            ,a.situacao
                            FROM ${this._table} a
                            INNER JOIN tb_especialidade especialidade ON (a.idEspecialidade = especialidade.id)
                            INNER JOIN tb_material material ON (a.idMaterial = material.id)
                            WHERE a.situacao = 1`, callback);
}

EspecialidadeMaterialDAO.prototype.listaPorEspecialidade = function(idEspecialidade, callback) {   
    this._connection.query(`SELECT
                             a.id
                            ,a.idEspecialidade
                            ,especialidade.nome nomeEspecialidade
                            ,a.idMaterial
                            ,material.descricao nomeMaterial
                            ,a.situacao
                            FROM ${this._table} a
                            INNER JOIN tb_especialidade especialidade ON (a.idEspecialidade = especialidade.id and especialidade.situacao = 1)
                            INNER JOIN tb_material material ON (a.idMaterial = material.id and material.situacao = 1)
                            WHERE a.situacao = 1 and a.idEspecialidade=?`, idEspecialidade, callback);
}

EspecialidadeMaterialDAO.prototype.buscaMaterialPorEspecialidade = function(idMaterial, idEspecialidade, callback) {   
    this._connection.query(`SELECT
                            count(1) total
                            FROM ${this._table} a                            
                            WHERE a.situacao = 1 and a.idMaterial=? and a.idEspecialidade=?`, [idMaterial, idEspecialidade], callback);
}

module.exports = function(){
    return EspecialidadeMaterialDAO;
};