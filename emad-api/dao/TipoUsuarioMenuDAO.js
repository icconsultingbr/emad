function TipoUsuarioMenuDAO(connection) {
    this._connection = connection;
    this._table = "tb_tipo_usuario_menu";
}


TipoUsuarioMenuDAO.prototype.lista = function(callback) {
    this._connection.query("select * FROM "+this._table+" WHERE situacao = 1 ORDER BY nome ASC",callback);
}

TipoUsuarioMenuDAO.prototype.listaTipoUsuario = function(id, callback) {
    this._connection.query("select m.idMenu, m.nome FROM "+this._table+" tum \
    INNER JOIN tb_menu as m ON(tum.idMenu = m.id) \
    WHERE tum.idTipoUsuario = ? ORDER BY nome ASC",id, callback);
}

TipoUsuarioMenuDAO.prototype.buscaPorId = function (id,callback) {
    this._connection.query("select * from "+this._table+" where id = ?",id,callback);
}

TipoUsuarioMenuDAO.prototype.salva = function(obj,callback) {
    this._connection.query("INSERT INTO "+this._table+" SET ?", obj, callback);
}

TipoUsuarioMenuDAO.prototype.atualiza = function(obj,id, callback) {
    this._connection.query("UPDATE "+this._table+" SET ?  where id= ?", [obj, id], callback); 
}


TipoUsuarioMenuDAO.prototype.deletaPermissoes = function(id, callback) {

    this._connection.query("DELETE FROM "+this._table+" WHERE idTipoUsuario = ?", id, callback);
}

TipoUsuarioMenuDAO.prototype.atualizaPermissoes = function(permissoes, callback) {
  
    this._connection.query("INSERT INTO "+this._table+" (idTipoUsuario, idMenu) VALUES "+permissoes, callback);
}

TipoUsuarioMenuDAO.prototype.deletaPorId = function (id,callback) {

    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}

module.exports = function(){
    return TipoUsuarioMenuDAO;
};