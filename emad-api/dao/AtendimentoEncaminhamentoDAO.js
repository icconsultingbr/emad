function AtendimentoEncaminhamentoDAO(connection) {
    this._connection = connection;
    this._table = "tb_atendimento_encaminhamento";
}

AtendimentoEncaminhamentoDAO.prototype.buscaPorAtendimentoId = function (idAtendimento,callback) {
    this._connection.query(` SELECT pe.id, e.nome, pe.motivo from ${this._table} pe 
    INNER JOIN tb_especialidade e ON(pe.idEspecialidade = e.id)     
    WHERE pe.situacao = 1 AND pe.idAtendimento = ?` ,idAtendimento,callback); 
}


module.exports = function(){
    return AtendimentoEncaminhamentoDAO;
};