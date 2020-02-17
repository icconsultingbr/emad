function NotificacaoUsuarioDAO(connection) {
    this._connection = connection;
    this._table = "tb_notificacao_usuario";
}

NotificacaoUsuarioDAO.prototype.salva = function(NotificacaoUsuario,callback) {    
    this._connection.query("INSERT INTO "+this._table+" SET ?", NotificacaoUsuario, callback);
}

NotificacaoUsuarioDAO.prototype.lista = function(callback) {
    this._connection.query(`
        SELECT *
        FROM ${this._table}
        ORDER BY id`,callback);
}

NotificacaoUsuarioDAO.prototype.buscaPorId = function (id,callback) {
    this._connection.query("select * from "+this._table+" where id = ?",id,callback);
}

NotificacaoUsuarioDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}

NotificacaoUsuarioDAO.prototype.atualizaPorId = function (NotificacaoUsuario, id,callback) {
    this._connection.query("UPDATE "+this._table+" SET ? where id= ?", [NotificacaoUsuario, id], callback);
}

NotificacaoUsuarioDAO.prototype.visualizadaPorId = function (notificacao_id, usuario_id, callback) {
    this._connection.query("UPDATE "+this._table+" SET dataVisualizacao = now() where idNotificacao = ? and idUsuario = ?", [notificacao_id, usuario_id], callback);
}

module.exports = function(){
    return NotificacaoUsuarioDAO;
};