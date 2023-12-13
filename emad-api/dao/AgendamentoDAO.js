function AgendamentoDAO(connection) {
    this._connection = connection;
    this._table = "tb_agendamento";
}

AgendamentoDAO.prototype.salva = function(obj, callback) {
    this._connection.query(`INSERT INTO ${this._table} SET ?`, obj, callback);
}

module.exports = function(){
    return AgendamentoDAO;
};