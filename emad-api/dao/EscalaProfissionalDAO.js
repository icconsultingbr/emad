function EscalaProfissionalDAO(connection) {
    this._connection = connection;
    this._table = "tb_escala_profissional";
}

EscalaProfissionalDAO.prototype.salva = function(obj, callback) {
    this._connection.query(`INSERT INTO ${this._table} SET ?`, obj, callback);
}

EscalaProfissionalDAO.prototype.atualiza = function(obj, id, callback) {
    this._connection.query(`UPDATE ${this._table} SET ? WHERE id= ?`, [obj, id], callback);
}

EscalaProfissionalDAO.prototype.buscaPorId = function (id, callback) {
    this._connection.query(`SELECT * FROM ${this._table} WHERE id = ?`,id,callback);
}

EscalaProfissionalDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}

EscalaProfissionalDAO.prototype.buscaPorProfissionalId = function (idProfissional, anomes, callback) {
    this._connection.query(`SELECT 
    e.id,
    e.domingoHorarioInicial,
    e.domingoHorarioFinal,
    e.segundaHorarioInicial,
    e.segundaHorarioFinal,
    e.tercaHorarioInicial,
    e.tercaHorarioFinal,
    e.quartaHorarioInicial,
    e.quartaHorarioFinal,
    e.quintaHorarioInicial,
    e.quintaHorarioFinal,
    e.sextaHorarioInicial,
    e.sextaHorarioFinal,
    e.sabadoHorarioInicial,
    e.sabadoHorarioFinal
    FROM ${this._table} e       
    INNER JOIN tb_profissional p on e.idProfissional = p.id         
    WHERE e.idProfissional = ${idProfissional} AND e.anoMes = '${anomes}'
    ORDER BY e.id DESC`,callback);
}

module.exports = function(){
    return EscalaProfissionalDAO;
};