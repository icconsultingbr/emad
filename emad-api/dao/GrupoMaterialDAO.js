function GenericDAO(connection,table) {
    this._connection = connection;
    this._table = `tb_grupo_material`;
}

GenericDAO.prototype.salva = function(obj, callback) {
    this._connection.query(`INSERT INTO ${this._table} SET ?`, obj, callback);
}

GenericDAO.prototype.atualiza = function(obj, id, callback) {
    this._connection.query(`UPDATE ${this._table} SET ? WHERE id= ?`, [obj, id], callback);
}

GenericDAO.prototype.lista = function(callback) {   
    this._connection.query(`SELECT * FROM ${this._table} WHERE situacao = 1`, callback);
}

GenericDAO.prototype.buscaPorId = function (id, callback) {
    this._connection.query(`SELECT * FROM ${this._table} WHERE id = ?`,id,callback);
}

GenericDAO.prototype.buscaSemVinculoEstabelecimento = function (idEstabelecimento, callback) {
    this._connection.query(`SELECT id, nome FROM ${this._table} a 
    where situacao = 1 and 
    not EXISTS (select * from tb_estabelecimento_grupo_material b 
    WHERE b.idGrupoMaterial = a.id and b.situacao = 1 and b.idEstabelecimento = ?)`,idEstabelecimento,callback);
}

GenericDAO.prototype.buscaDominio = function (callback) {
    this._connection.query(`SELECT id, nome FROM ${this._table} WHERE situacao = 1`, callback);
}

GenericDAO.prototype.dominio = function (callback) {
    this._connection.query(`SELECT id, nome FROM ${this._table} WHERE situacao = 1`, callback);
}

GenericDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}

module.exports = function(){
    return GenericDAO;
};