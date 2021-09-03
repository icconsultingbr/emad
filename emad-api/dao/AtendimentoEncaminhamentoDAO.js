function AtendimentoEncaminhamentoDAO(connection) {
    this._connection = connection;
    this._table = "tb_atendimento_encaminhamento";
}

AtendimentoEncaminhamentoDAO.prototype.buscaPorAtendimentoId = function (idAtendimento, callback) {
    this._connection.query(` SELECT pe.id, e.nome, pe.motivo from ${this._table} pe 
    INNER JOIN tb_especialidade e ON(pe.idEspecialidade = e.id)     
    WHERE pe.situacao = 1 AND pe.idAtendimento = ?` , idAtendimento, callback);
}

AtendimentoEncaminhamentoDAO.prototype.buscaEncaminhamentoPorPacienteId = function (idUsuario, callback) {
    let encaminhamentos = this._connection.query(`SELECT te.nome, tae.motivo, tae.dataCriacao FROM ${this._table} tae 
    JOIN tb_especialidade te ON (tae.idEspecialidade = te.id) 
    WHERE tae.idPaciente = ?`, idUsuario, callback);
    return encaminhamentos
}

module.exports = function () {
    return AtendimentoEncaminhamentoDAO;
};