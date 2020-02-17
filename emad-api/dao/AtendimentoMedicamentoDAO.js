function AtendimentoMedicamentoDAO(connection) {
    this._connection = connection;
    this._table = "tb_atendimento_medicamento";
}

AtendimentoMedicamentoDAO.prototype.buscaPorAtendimentoId = function (idAtendimento,callback) {
    this._connection.query(`SELECT 
        am.id, 
        m.nome as idMedicamento, 
        am.uso, 
        am.tipoVia,
        am.quantidade,
        am.apresentacao, 
        am.posologia, 
        am.idAtendimento, 
        am.situacao, 
        am.idPaciente  
    
    from ${this._table} am
    INNER JOIN tb_medicamento m ON(am.idMedicamento = m.id)     
    WHERE am.situacao = 1 AND am.idAtendimento = ?` ,idAtendimento,callback); 
}


module.exports = function(){
    return AtendimentoMedicamentoDAO;
};