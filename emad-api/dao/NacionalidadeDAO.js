function NacionalidadeDAO(connection) {
    this._connection = connection;
    this._table = "tb_nacionalidade";
}


NacionalidadeDAO.prototype.lista = function(callback) {
    this._connection.query("select * FROM "+this._table+" WHERE situacao = 1 ORDER BY nome ASC",callback);
}

NacionalidadeDAO.prototype.dominio = function(callback) {
    this._connection.query("select id, nome FROM "+this._table+" WHERE situacao = 1 ORDER BY nome ASC",callback);
}

NacionalidadeDAO.prototype.buscaPorId = function (id,callback) {
    this._connection.query("select * from "+this._table+" where id = ?",id,callback); 
}

NacionalidadeDAO.prototype.salva = function(objeto,callback) {
    this._connection.query("INSERT INTO "+this._table+" SET ?", objeto, callback);
}

NacionalidadeDAO.prototype.atualiza = function(objeto,id, callback) {
    this._connection.query("UPDATE "+this._table+" SET ?  where id= ?", [objeto, id], callback);
}

NacionalidadeDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}

NacionalidadeDAO.prototype.buscaPorIdSync = async function (id) {
    return await this._connection.query("select * from "+this._table+" where id = ?",id); 
}


module.exports = function(){
    return NacionalidadeDAO;
};