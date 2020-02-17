function EspecialidadeDAO(connection) {
    this._connection = connection;
    this._table = "tb_especialidade";
}


EspecialidadeDAO.prototype.lista = function(callback) {
    this._connection.query("select * FROM "+this._table+" ORDER BY nome ASC",callback);
}

EspecialidadeDAO.prototype.dominio = function(callback) {
    this._connection.query("select id, nome FROM "+this._table+" ORDER BY nome ASC",callback);
}

EspecialidadeDAO.prototype.buscaPorId = function (id,callback) {
    this._connection.query("select * from "+this._table+" where id = ?",id,callback);
}

EspecialidadeDAO.prototype.salva = function (objeto,callback){
    this._connection.query("INSERT INTO "+this._table+" SET ?", objeto, callback);
}

EspecialidadeDAO.prototype.atualiza = function (){
    this._connection.query("UPDATE "+this._table+" SET ?  where id= ?", [objeto, id], callback);
}

EspecialidadeDAO.prototype.deletaPorId = function (){
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}


module.exports = function(){
    return EspecialidadeDAO;
};