function AtendimentoEncaminhamentoDAO(connection) {
    this._connection = connection;
    this._table = "tb_atendimento_encaminhamento";
}

AtendimentoEncaminhamentoDAO.prototype.buscaPorAtendimentoId = function (idAtendimento, callback) {
    this._connection.query(` SELECT pe.id, e.nome, pe.motivo from ${this._table} pe 
    INNER JOIN tb_especialidade e ON(pe.idEspecialidade = e.id)     
    WHERE pe.situacao = 1 AND pe.idAtendimento = ?` , idAtendimento, callback);
}

AtendimentoEncaminhamentoDAO.prototype.buscaEncaminhamentoPorPacienteId = function (idUsuario, tipoFicha, profissional, callback) {
    var where = "";

    if(tipoFicha > 0)
        where += " and a.tipoFicha = " + tipoFicha;

    if(profissional > 0)
        where += " and tp.id = " + profissional;
   
    let encaminhamentos = this._connection.query(`SELECT te.nome, tae.motivo, tae.dataCriacao FROM ${this._table} tae 
    JOIN tb_especialidade te ON (tae.idEspecialidade = te.id) 
    inner join tb_atendimento a ON (tae.idAtendimento = a.id)
    left join tb_profissional tp on tp.idUsuario = a.idUsuario  
    WHERE tae.idPaciente = ? ${where} `, idUsuario, callback);
    return encaminhamentos
}

module.exports = function () {
    return AtendimentoEncaminhamentoDAO;
};