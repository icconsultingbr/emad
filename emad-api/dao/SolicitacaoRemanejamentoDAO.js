function SolicitacaoRemanejamentoDAO(connection) {
    this._connection = connection;
    this._table = `tb_solicitacao_remanejamento`;
}

SolicitacaoRemanejamentoDAO.prototype.salva = async function(obj) {
    const result = await this._connection.query(`INSERT INTO tb_solicitacao_remanejamento (idEstabelecimentoSolicitada, idEstabelecimentoSolicitante,
                                                    situacao, idUsuarioCriacao, dataCriacao) VALUES (?, ?, ?, ?, ?)`, 
        [obj.idEstabelecimentoSolicitada, obj.idEstabelecimentoSolicitante, obj.situacao, obj.idUsuarioCriacao, obj.dataCriacao]);
    return [result];
}

SolicitacaoRemanejamentoDAO.prototype.atualiza = async function(obj, id) {        
    const result =  await this._connection.query(`UPDATE tb_solicitacao_remanejamento 
                    SET idEstabelecimentoSolicitada = ?, idEstabelecimentoSolicitante = ?, 
                    situacao = ?, idUsuarioAlteracao = ?, dataAlteracao  = ? WHERE id= ?`,
                    [obj.idEstabelecimentoSolicitada, obj.idEstabelecimentoSolicitante, obj.situacao, obj.idUsuarioAlteracao, obj.dataAlteracao, id]);
    return [result];
}

SolicitacaoRemanejamentoDAO.prototype.buscaPorId = async function (id) {
    const result = await this._connection.query(`SELECT * FROM ${this._table} WHERE id = ?`,id);    
    return result;
}

SolicitacaoRemanejamentoDAO.prototype.deletaPorId =  async function (id) {
    const result = await this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id);    
    return [result];
}

SolicitacaoRemanejamentoDAO.prototype.lista = async function(addFilter, pendente) {   
    let where = "";

    if (addFilter.idEstabelecimento && pendente) {
        where +=" AND a.idEstabelecimentoSolicitante  = " + addFilter.idEstabelecimento;
    }

    if (addFilter.idEstabelecimento && !pendente) {
        where +=" AND a.idEstabelecimentoSolicitada  = " + addFilter.idEstabelecimento;
    }

    const result = await this._connection.query(`SELECT
                                                    a.id
                                                ,a.idEstabelecimentoSolicitada
                                                ,estabelecimento_solicitada.nomeFantasia nomeEstabelecimentoSolicitada
                                                ,a.idEstabelecimentoSolicitante
                                                ,estabelecimento_solicitante.nomeFantasia nomeEstabelecimentoSolicitante
                                                ,a.situacao
                                                ,a.dataCriacao
                                                ,a.dataAlteracao
                                                FROM ${this._table} a
                                                INNER JOIN tb_estabelecimento estabelecimento_solicitada ON (a.idEstabelecimentoSolicitada = estabelecimento_solicitada.id)
                                                INNER JOIN tb_estabelecimento estabelecimento_solicitante ON (a.idEstabelecimentoSolicitante = estabelecimento_solicitante.id)
                                                WHERE a.situacao = 1 ${where}`);    
    return result;    
}

module.exports = function(){
    return SolicitacaoRemanejamentoDAO;
};