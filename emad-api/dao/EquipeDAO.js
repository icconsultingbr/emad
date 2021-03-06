function EquipeDAO(connection) {
    this._connection = connection;
    this._table = "tb_equipe";
}

EquipeDAO.prototype.salva = function(obj, callback) {
    this._connection.query(`INSERT INTO ${this._table} SET ?`, obj, callback);
}

EquipeDAO.prototype.atualiza = function(obj, id, callback) {
    this._connection.query(`UPDATE ${this._table} SET ? WHERE id= ?`, [obj, id], callback);
}

EquipeDAO.prototype.lista = function(callback) {
   
    this._connection.query(`SELECT * FROM ${this._table} WHERE situacao = 1`, callback);
}

EquipeDAO.prototype.buscaPorId = function (id, callback) {
    this._connection.query(`SELECT * FROM ${this._table} WHERE id = ?`,id,callback);
}

EquipeDAO.prototype.buscaPorEquipe = function (equipe, idEstabelecimento,  callback) {
    this._connection.query(`SELECT 
    e.id,
    e.equipe,
    e.cnes, 
    IFNULL(e.nome, e2.nome) as nome, 
    e.tipo, 
    e.situacao,
    e.idEstabelecimento,
    e.idEquipeEmad,
    e.dataCriacao s
    
    FROM ${this._table} e 
    LEFT JOIN tb_equipe e2 ON(e.idEquipeEmad = e2.id) 
    WHERE e.equipe = '${equipe}' AND e.idEstabelecimento = ${idEstabelecimento} AND e.situacao = 1`,callback);
}

EquipeDAO.prototype.buscaDominio = function (callback) {
    this._connection.query(`SELECT id, nome FROM ${this._table}`, callback);
}

EquipeDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}

EquipeDAO.prototype.dominio = function(callback) {
    this._connection.query("select id, nome FROM "+this._table+" WHERE equipe ='emad' AND situacao = 1 ORDER BY nome ASC",callback);
}

module.exports = function(){
    return EquipeDAO;
};