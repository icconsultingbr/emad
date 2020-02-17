function TipoUnidadeDAO(connection) {
    this._connection = connection;
    this._table = "tb_tipo_unidade";
}


TipoUnidadeDAO.prototype.lista = function(callback) {
    this._connection.query("select * FROM "+this._table+" WHERE situacao = 1 ORDER BY nome ASC",callback);
}

TipoUnidadeDAO.prototype.dominio = function(callback) {
    this._connection.query("select id, nome FROM "+this._table+" WHERE situacao = 1 ORDER BY nome ASC",callback);
}

TipoUnidadeDAO.prototype.buscaPorId = function (id,callback) {
    this._connection.query("select * from "+this._table+" where id = ?",id,callback); 
}

TipoUnidadeDAO.prototype.salva = function(objeto,callback) {
    this._connection.query("INSERT INTO "+this._table+" SET ?", objeto, callback);
}

TipoUnidadeDAO.prototype.atualiza = function(objeto,id, callback) {
    this._connection.query("UPDATE "+this._table+" SET ?  where id= ?", [objeto, id], callback);
}

TipoUnidadeDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}


module.exports = function(){
    return TipoUnidadeDAO;
};