function HipoteseDiagnosticaDAO(connection) {
    this._connection = connection;
    this._table = "tb_hipotese_diagnostica";
}


HipoteseDiagnosticaDAO.prototype.lista = function(callback) {
    this._connection.query("select * FROM "+this._table+" WHERE situacao = 1 ORDER BY nome ASC",callback);
}

HipoteseDiagnosticaDAO.prototype.dominio = function(callback) {
    this._connection.query("select id, CONCAT(codigo, ' - ', nome) as nome FROM "+this._table+" WHERE situacao = 1 ORDER BY codigo ASC",callback);
}

HipoteseDiagnosticaDAO.prototype.buscaPorId = function (id,callback) {
    this._connection.query("select * from "+this._table+" where id = ?",id,callback); 
}

HipoteseDiagnosticaDAO.prototype.salva = function(objeto,callback) {
    this._connection.query("INSERT INTO "+this._table+" SET ?", objeto, callback);
}

HipoteseDiagnosticaDAO.prototype.atualiza = function(objeto,id, callback) {
    this._connection.query("UPDATE "+this._table+" SET ?  where id= ?", [objeto, id], callback);
}

HipoteseDiagnosticaDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}


module.exports = function(){
    return HipoteseDiagnosticaDAO;
};