function NotificacaoDAO(connection) {
    this._connection = connection;
    this._table = "tb_notificacao";
}

NotificacaoDAO.prototype.salva = function(Notificacao,callback) {
    this._connection.query("INSERT INTO "+this._table+" SET ?", Notificacao, callback);
}

NotificacaoDAO.prototype.lista = function(callback) {
    this._connection.query(`
        SELECT 
        n.id, n.titulo, n.descricao, n.idUsuarioCriacao, 
        n.idTipoUsuario, n.idUsuario, n.url, n.situacao, 
        n.tipo, fnc_tipo_notificacao(n.tipo) as tipoFormatado, 
        n.dataCriacao, n.dataCancelamento, n.motivoCancelamento,
        n.dataDisponibilidade, tu.nome as tipoUsuarioNome
        FROM ${this._table} n
        INNER JOIN tb_tipo_usuario tu ON (tu.id = n.idTipoUsuario)
        WHERE n.situacao = 1 ORDER BY dataCriacao DESC`,callback);
}

NotificacaoDAO.prototype.listaPorUsuarioId = function(id, callback) {
    this._connection.query(`
        SELECT 
        n.id, n.titulo, n.descricao, n.url,  
        n.tipo, fnc_tipo_notificacao(n.tipo) as tipoFormatado,
        case when nu.dataVisualizacao is null then 1 else 0 end as 'novo',    
        DATE_FORMAT(case when n.dataDisponibilidade is null then n.dataCriacao else n.dataDisponibilidade end, " %d/%m/%Y") as 'data'
        FROM ${this._table} as n
        INNER JOIN tb_notificacao_usuario as nu ON (nu.idNotificacao = n.id) 
        WHERE n.situacao = 1 AND (n.dataDisponibilidade IS NULL OR n.dataDisponibilidade < now()) AND nu.idUsuario = ? 
        ORDER BY novo desc, n.dataCriacao DESC`, id, callback);
}

NotificacaoDAO.prototype.listaPorUsuarioIdById = function(id,idNotificacao, callback) {
    this._connection.query(`
        SELECT 
        n.id, n.titulo, n.descricao, n.url,  
        n.tipo, fnc_tipo_notificacao(n.tipo) as tipoFormatado,
        case when nu.dataVisualizacao is null then 1 else 0 end as 'novo',    
        DATE_FORMAT(case when n.dataDisponibilidade is null then n.dataCriacao else n.dataDisponibilidade end, " %d/%m/%Y") as 'data'
        FROM ${this._table} as n
        INNER JOIN tb_notificacao_usuario as nu ON (nu.idNotificacao = n.id) 
        WHERE n.situacao = 1 AND (n.dataDisponibilidade IS NULL OR n.dataDisponibilidade < now()) AND nu.idUsuario = ? AND n.id = ?
        ORDER BY novo desc, n.dataCriacao DESC`, [id,idNotificacao], callback);
}

NotificacaoDAO.prototype.buscaPorId = function (id,callback) {
    this._connection.query("select * from "+this._table+" where id = ?",id,callback);
}

NotificacaoDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}

NotificacaoDAO.prototype.atualizaPorId = function (Notificacao, id,callback) {
    this._connection.query("UPDATE "+this._table+" SET ? where id= ?", [Notificacao, id], callback);
}

module.exports = function(){
    return NotificacaoDAO;
};