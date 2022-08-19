function AtendimentoHipoteseDiagnosticaDAO(connection) {
    this._connection = connection;
    this._table = "tb_atendimento_hipotese_diagnostica";
}

AtendimentoHipoteseDiagnosticaDAO.prototype.buscarPorAtendimentoId = async function (idAtendimento) {
    let atendimento =  await this._connection.query(`select phd.id, hd.codigo, hd.nome  from ${this._table} phd 
    INNER JOIN tb_hipotese_diagnostica hd ON(phd.idHipoteseDiagnostica = hd.id)     
    WHERE phd.situacao = 1 AND phd.idAtendimento = ?` ,idAtendimento); 
    return atendimento;
}

AtendimentoHipoteseDiagnosticaDAO.prototype.listarPorPaciente = async function (id, tipoFicha, profissional) {
    var where = "";

    if(tipoFicha > 0)
        where += " and a.tipoFicha = " + tipoFicha;

    if(profissional > 0)
        where += " and tp.id = " + profissional;

    let atendimento =  await this._connection.query(`select phd.id, hd.codigo, hd.nome, phd.idAtendimento, phd.dataCriacao, hd.cid_10, phd.idExame 
            from ${this._table} phd 
            INNER JOIN tb_hipotese_diagnostica hd ON(phd.idHipoteseDiagnostica = hd.id)  
            inner join tb_atendimento a ON (phd.idAtendimento = a.id)
            left join tb_profissional tp on tp.idUsuario = a.idUsuario     
            WHERE phd.situacao = 1 AND phd.idPaciente = ? ${where} `,id); 
    return atendimento;
}

AtendimentoHipoteseDiagnosticaDAO.prototype.listarPorPacienteAgrupada = async function (id) {
    let atendimento =  await this._connection.query(`select hd.nome label, count(*) data from ${this._table} phd 
            INNER JOIN tb_hipotese_diagnostica hd ON(phd.idHipoteseDiagnostica = hd.id)     
            WHERE phd.situacao = 1 AND phd.idPaciente = ?
            group by hd.nome`,id); 
    return atendimento;
}

AtendimentoHipoteseDiagnosticaDAO.prototype.deletaPorId = async function (obj) {
    let atendimento =  await this._connection.query(`UPDATE ${this._table} set situacao=?, idUsuarioAlteracao=?, dataAlteracao=? where id=?`
    , [obj.situacao, obj.idUsuarioAlteracao, obj.dataAlteracao, obj.id]); 
    return atendimento;
}

AtendimentoHipoteseDiagnosticaDAO.prototype.salva = async function(objeto) {
    const response = await this._connection.query("INSERT INTO " + this._table + " SET ?", objeto);
    return [response];
}

AtendimentoHipoteseDiagnosticaDAO.prototype.validaHipotesePorPaciente = async function (obj) {
    let pacienteResult =  await this._connection.query(`select * from ${this._table} WHERE situacao = 1 and idPaciente=? and idHipoteseDiagnostica=?`,
    [obj.idPaciente, obj.idHipoteseDiagnostica]);
    return pacienteResult; 
}

module.exports = function(){
    return AtendimentoHipoteseDiagnosticaDAO;
};