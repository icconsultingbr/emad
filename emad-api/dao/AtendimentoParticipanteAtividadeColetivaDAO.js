function AtendimentoParticipanteAtividadeColetivaDAO(connection) {
    this._connection = connection;
    this._table = "tb_atividade_coletiva_participantes";
}
AtendimentoParticipanteAtividadeColetivaDAO.prototype.buscaPorAtendimentoId = function (idAtendimento, callback) {
    this._connection.query(`SELECT 
      atvcol.id,
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


module.exports = function () {
    return AtendimentoParticipanteAtividadeColetivaDAO;
};