function AtendimentoParticipanteAtividadeColetivaDAO(connection) {
    this._connection = connection;
    this._table = "tb_atividade_coletiva_participantes";
}
AtendimentoParticipanteAtividadeColetivaDAO.prototype.buscaPorAtendimentoId = function (idAtendimento, callback) {
    this._connection.query(`SELECT 
      atvcol.id,
      atvcol.idPaciente,
      paciente.cartaoSus,
      paciente.nome,
      paciente.dataNascimento,
      paciente.sexo,
      atvcol.avaliacaoAlterada,
      atvcol.abandonouGrupo,
      atvcol.parouFumar
    from ${this._table} atvcol   
    INNER JOIN tb_paciente paciente ON (paciente.id = atvcol.idPaciente) 
    WHERE atvcol.idAtendimento = ?` , idAtendimento, callback);
}

AtendimentoParticipanteAtividadeColetivaDAO.prototype.deletaPorId = function (id, callback) {
    this._connection.query(`DELETE FROM ${this._table} WHERE id=?`, id, callback);
}

AtendimentoParticipanteAtividadeColetivaDAO.prototype.salvaSync = async function (objeto) {
    const response = await this._connection.query("INSERT INTO " + this._table + " SET ?", objeto);
    return [response];
}

module.exports = function () {
    return AtendimentoParticipanteAtividadeColetivaDAO;
};