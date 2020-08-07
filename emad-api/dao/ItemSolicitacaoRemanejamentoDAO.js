function ItemSolicitacaoRemanejamentoDAO(connection) {
    this._connection = connection;
    this._table = `tb_item_solicitacao_remanejamento`;
}

ItemSolicitacaoRemanejamentoDAO.prototype.salva = async function(obj) {
    const result = await this._connection.query(`INSERT INTO tb_item_solicitacao_remanejamento 
            (idSolicitacaoRemanejamento, idMaterial, qtdSolicitada, qtdAtendida, situacao, idUsuarioCriacao, dataCriacao) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`, 
        [obj.idSolicitacaoRemanejamento, obj.idMaterial, obj.qtdSolicitada, obj.qtdAtendida, obj.situacao, obj.idUsuarioCriacao, obj.dataCriacao]);
    return [result];
}

ItemSolicitacaoRemanejamentoDAO.prototype.atualiza = async function(obj) {        
    const result =  await this._connection.query(`UPDATE tb_item_solicitacao_remanejamento 
                    SET idSolicitacaoRemanejamento = ?, idMaterial = ?, qtdSolicitada = ?, qtdAtendida = ?,  
                    situacao = ?, idUsuarioAlteracao = ?, dataAlteracao  = ? WHERE id= ?`,
                    [obj.idSolicitacaoRemanejamento, obj.idMaterial, obj.qtdSolicitada, obj.qtdAtendida, 
                    obj.situacao, obj.idUsuarioAlteracao, obj.dataAlteracao, obj.id]);
    return [result];
}

ItemSolicitacaoRemanejamentoDAO.prototype.buscarPorSolicitacaoRemanejamento = async function(idSolicitacao) {   
    const itemReceita = await  this._connection.query(`SELECT
                                a.id
                                ,a.idSolicitacaoRemanejamento
                                ,a.idMaterial
                                ,material.descricao nomeMaterial
                                ,material.codigo codigoMaterial
                                ,a.qtdSolicitada
                                ,a.qtdAtendida                                
                                ,a.situacao 
                                ,UUID() as idFront                              
                                FROM ${this._table} a
                                INNER JOIN tb_material material ON (a.idMaterial = material.id)
                                WHERE a.situacao > 0 and a.idSolicitacaoRemanejamento=?`,idSolicitacao);
    return itemReceita;
}

module.exports = function(){
    return ItemSolicitacaoRemanejamentoDAO;
};