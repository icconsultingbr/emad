function UfDAO(connection) {
    this._connection = connection;
    this._table = "tb_uf";
}


UfDAO.prototype.lista = function(callback) {
    this._connection.query("select * FROM "+this._table+" ORDER BY nome ASC",callback);
}

UfDAO.prototype.dominio = function(callback) {
    this._connection.query("select id, nome FROM "+this._table+" ORDER BY nome ASC",callback);
}

UfDAO.prototype.buscaPorId = function (id,callback) {
    this._connection.query("select * from "+this._table+" where id = ?",id,callback);
}


UfDAO.prototype.buscarPorUf = function (uf,callback) {
    this._connection.query("select id from "+this._table+" where uf = ?",uf,callback);
}

UfDAO.prototype.buscaPorPais = function (idPais,callback) {
    this._connection.query("select id, nome from "+this._table+" where idPais = ?",idPais,callback);
}



module.exports = function(){
    return UfDAO;
};