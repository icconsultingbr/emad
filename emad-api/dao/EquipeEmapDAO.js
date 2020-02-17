function EquipeEmapDAO(connection) {
    this._connection = connection;
    this._table = "tb_equipe_emap";
}


EquipeEmapDAO.prototype.lista = function(callback) {
    this._connection.query("select * FROM "+this._table+" WHERE situacao = 1 ORDER BY nome ASC",callback);
}

EquipeEmapDAO.prototype.dominio = function(callback) {
    this._connection.query("select id, nome FROM "+this._table+" WHERE situacao = 1 ORDER BY nome ASC",callback);
}

EquipeEmapDAO.prototype.buscaPorId = function (id,callback) {
    this._connection.query("select * from "+this._table+" where id = ?",id,callback); 
}

EquipeEmapDAO.prototype.salva = function(objeto,callback) {
    this._connection.query("INSERT INTO "+this._table+" SET ?", objeto, callback);
}

EquipeEmapDAO.prototype.atualiza = function(objeto,id, callback) {
    this._connection.query("UPDATE "+this._table+" SET ?  where id= ?", [objeto, id], callback);
}

EquipeEmapDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}


module.exports = function(){
    return EquipeEmapDAO;
};