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

ItemMovimentoGeralDAO.prototype.buscarPorItemReceita = async function(idReceita, idItemReceita) {   
    const itemMovimentoGeralReceita = await  this._connection.query(`select item_movto.lote, fabricante.nome, item_movto.validade, item_movto.quantidade, 
    usuario.nome as nomeUsuario, item_movto.dataCriacao as dataUltDis 
    from tb_movimento_geral movto 
    inner join tb_receita receita on receita.id = movto.idReceita 
    inner join tb_item_movimento_geral item_movto on movto.id = item_movto.idMovimentoGeral
    inner join tb_item_receita item_receita on item_receita.idReceita = receita.id and item_receita.id = item_movto.IdItemReceita
    inner join tb_fabricante_material fabricante on item_movto.idFabricante = fabricante.id
    inner join tb_usuario usuario on usuario.id = idUsuario
                                    where receita.id = ? and item_receita.id=?`,[idReceita, idItemReceita]);

    return itemMovimentoGeralReceita;
}

module.exports = function(){
    return ItemMovimentoGeralDAO;
};