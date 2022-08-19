function AtendimentoProcedimentoDAO(connection) {
    this._connection = connection;
    this._table = "tb_atendimento_procedimento";
}

AtendimentoProcedimentoDAO.prototype.buscarPorAtendimentoId = async function (idAtendimento) {
    let atendimento = await this._connection.query(`select phd.id, hd.co_procedimento, hd.no_procedimento, phd.qtd from ${this._table} phd 
    INNER JOIN tb_procedimento hd ON(phd.idProcedimento = hd.id)     
    WHERE phd.situacao = 1 AND phd.idAtendimento = ?` , idAtendimento);
    return atendimento;
}

AtendimentoProcedimentoDAO.prototype.listarPorPaciente = async function (id, tipoFicha, profissional) {
    var where = "";

    if(tipoFicha > 0)
        where += " and ta.tipoFicha = " + tipoFicha;

    if(profissional > 0)
        where += " and tp.id = " + profissional;

    let atendimento = await this._connection.query(`select phd.id, hd.co_procedimento, hd.no_procedimento, phd.idAtendimento, phd.dataCriacao,
            te.id, te.nomeFantasia, tp.id, tp.nome 
            from ${this._table} phd 
            INNER JOIN tb_procedimento hd ON(phd.idProcedimento = hd.id)
            INNER JOIN tb_atendimento ta ON(phd.idAtendimento = ta.id)
            INNER JOIN tb_estabelecimento te ON(ta.idEstabelecimento = te.id)
            INNER JOIN tb_profissional tp ON(ta.idUsuario = tp.idUsuario)     
            WHERE phd.situacao = 1 AND phd.idPaciente = ? ${where} `, id);
    return atendimento;
}

AtendimentoProcedimentoDAO.prototype.listarPorPacienteAgrupada = async function (id) {
    let atendimento = await this._connection.query(`select hd.nome label, count(*) data from ${this._table} phd 
            INNER JOIN tb_procedimento hd ON(phd.idProcedimento = hd.id)     
            WHERE phd.situacao = 1 AND phd.idPaciente = ?
            group by hd.nome`, id);
    return atendimento;
}

AtendimentoProcedimentoDAO.prototype.deletaPorId = async function (obj) {
    let atendimento = await this._connection.query(`UPDATE ${this._table} set situacao=?, idUsuarioAlteracao=?, dataAlteracao=? where id=?`
        , [obj.situacao, obj.idUsuarioAlteracao, obj.dataAlteracao, obj.id]);
    return atendimento;
}

AtendimentoProcedimentoDAO.prototype.salva = async function (objeto) {
    const response = await this._connection.query("INSERT INTO " + this._table + " SET ?", objeto);
    return [response];
}

AtendimentoProcedimentoDAO.prototype.validaHipotesePorPaciente = async function (obj) {
    let pacienteResult = await this._connection.query(`select * from ${this._table} WHERE situacao = 1 and idPaciente=? and idProcedimento=?`,
        [obj.idPaciente, obj.idProcedimento]);
    return pacienteResult;
}

module.exports = function () {
    return AtendimentoProcedimentoDAO;
};