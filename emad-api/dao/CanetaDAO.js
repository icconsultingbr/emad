function CanetaDAO(connection) {
    this._connection = connection;
    this._table = "tb_caneta";
}

CanetaDAO.prototype.salva = function(obj, callback) {
    this._connection.query(`INSERT INTO ${this._table} SET ?`, obj, callback);
}

CanetaDAO.prototype.atualiza = function(obj, id, callback) {
    this._connection.query(`UPDATE ${this._table} SET ? WHERE id= ?`, [obj, id], callback);
}

CanetaDAO.prototype.lista = function(addFilter, callback) {
    
    let where = "";

    if (addFilter.idEstabelecimento) {
        where+=" AND c.idEstabelecimento  = "+addFilter.idEstabelecimento;
    }

    this._connection.query(`SELECT 
    c.id,
    c.modelo,
    c.serialNumber, 
    c.situacao,
    c.idEstabelecimento,    
    c.dataCriacao,    
    e.nomeFantasia
    FROM ${this._table} c     
    INNER JOIN tb_estabelecimento e ON(c.idEstabelecimento = e.id) 
    WHERE 1=1 ${where}`,callback);    
}

CanetaDAO.prototype.buscaPorId = function (id, callback) {
    this._connection.query(`SELECT * FROM ${this._table} WHERE id = ?`,id,callback);
}

CanetaDAO.prototype.buscaPorEstabelecimento = function (idEstabelecimento,  callback) {
    this._connection.query(`SELECT 
    c.id,
    c.modelo,
    c.serialNumber, 
    c.situacao,
    c.idEstabelecimento,    
    c.dataCriacao,    
    e.nomeFantasia  
    FROM ${this._table} c    
    INNER JOIN tb_estabelecimento e ON(c.idEstabelecimento = e.id)  
    WHERE c.idEstabelecimento = ${idEstabelecimento} AND c.situacao = 1`,callback);
}

CanetaDAO.prototype.buscaDominio = function (callback) {
    this._connection.query(`SELECT id, nome FROM ${this._table}`, callback);
}

CanetaDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}

CanetaDAO.prototype.dominio = function(callback) {
    this._connection.query("select id, serialNumber as nome FROM "+this._table+" WHERE situacao = 1 ORDER BY serialNumber ASC",callback);
}

module.exports = function(){
    return CanetaDAO;
};