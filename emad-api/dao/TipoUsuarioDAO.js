function TipoUsuarioDAO(connection) {
    this._connection = connection;
    this._table = "tb_tipo_usuario";
}


TipoUsuarioDAO.prototype.lista = function(callback) {
    this._connection.query("select * FROM "+this._table+" WHERE situacao = 1 ORDER BY nome ASC",callback);
}

TipoUsuarioDAO.prototype.listaPorAdmin = function(su, callback) {
    this._connection.query(`select * FROM ${this._table} WHERE situacao = 1 AND id != ${su} ORDER BY nome ASC`,callback);
}

TipoUsuarioDAO.prototype.buscaPorId = function (id,callback) {
    this._connection.query("select * from "+this._table+" where id = ?",id,callback);
}

TipoUsuarioDAO.prototype.salva = function(grupo,callback) {
    this._connection.query("INSERT INTO "+this._table+" SET ?", grupo, callback);
}

TipoUsuarioDAO.prototype.atualiza = function(grupo,id, callback) {
    this._connection.query("UPDATE "+this._table+" SET ?  where id= ?", [grupo, id], callback);
}

TipoUsuarioDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}

module.exports = function(){
    return TipoUsuarioDAO;
};