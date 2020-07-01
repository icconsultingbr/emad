function ItemMovimentoGeralDAO(connection) {
    this._connection = connection;
    this._table = `tb_item_movimento_geral`;
}

ItemMovimentoGeralDAO.prototype.salva = async function(obj) {
    const novoItemMovimentoGeral = await this._connection.query(`INSERT INTO tb_item_movimento_geral (idMovimentoGeral, idMaterial, idFabricante, lote, validade, 
                                                         quantidade, idItemReceita, situacao, idUsuarioCriacao, dataCriacao)
                                                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                                                          [obj.idMovimentoGeral, obj.idMaterial, obj.idFabricante,
                                                            obj.lote, new Date(obj.validade), obj.quantidade, obj.idItemReceita, 
                                                            obj.situacao, obj.idUsuarioCriacao, obj.dataCriacao]);                                                            
    return [novoItemMovimentoGeral];
}

module.exports = function(){
    return ItemMovimentoGeralDAO;
};