function AtendimentoHipoteseDiagnosticaDAO(connection) {
    this._connection = connection;
    this._table = "tb_atendimento_hipotese_diagnostica";
}

AtendimentoHipoteseDiagnosticaDAO.prototype.buscarPorAtendimentoId = function (idAtendimento,callback) {
    this._connection.query(`select phd.id, hd.codigo, hd.nome  from ${this._table} phd 
    INNER JOIN tb_hipotese_diagnostica hd ON(phd.idHipoteseDiagnostica = hd.id) 
    
    WHERE phd.situacao = 1 AND phd.idAtendimento = ?` ,idAtendimento,callback); 
}

AtendimentoHipoteseDiagnosticaDAO.prototype.listarPorPaciente = async function (id) {
    let atendimento =  await this._connection.query(`select phd.id, hd.codigo, hd.nome, phd.idAtendimento  from ${this._table} phd 
            INNER JOIN tb_hipotese_diagnostica hd ON(phd.idHipoteseDiagnostica = hd.id)     
            WHERE phd.situacao = 1 AND phd.idPaciente = ?`,[id]); 
    return atendimento;
}

module.exports = function(){
    return AtendimentoHipoteseDiagnosticaDAO;
};