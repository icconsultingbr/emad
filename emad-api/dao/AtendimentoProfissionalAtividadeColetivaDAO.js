function AtendimentoProfissionalAtividadeColetivaDAO(connection) {
    this._connection = connection;
    this._table = "tb_atividade_coletiva_profissionais";
}
AtendimentoProfissionalAtividadeColetivaDAO.prototype.buscaPorAtendimentoId = function (idAtendimento, callback) {
    this._connection.query(`SELECT 
      atvcol.id,
      profissional.nome,
      profissional.profissionalCNS,
      profissional.cargoProfissional
    from ${this._table} atvcol   
    INNER JOIN tb_profissional profissional ON (atvcol.idProfissional = profissional.id ) 
    WHERE atvcol.idAtendimento = ?` , idAtendimento, callback);
}

AtendimentoProfissionalAtividadeColetivaDAO.prototype.deletaPorId = function (id, callback) {
    this._connection.query(`DELETE FROM ${this._table} WHERE id=?`, id, callback);
}

AtendimentoProfissionalAtividadeColetivaDAO.prototype.salvaSync = async function (objeto) {
    const response = await this._connection.query("INSERT INTO " + this._table + " SET ?", objeto);
    return [response];
}

AtendimentoProfissionalAtividadeColetivaDAO.prototype.atualizaPorId = async function (objeto, id) {
    let profissional = await this._connection.query("UPDATE " + this._table + " SET ?  where id= ?", [objeto, id]);

    return profissional[0];
}

module.exports = function () {
    return AtendimentoProfissionalAtividadeColetivaDAO;
};