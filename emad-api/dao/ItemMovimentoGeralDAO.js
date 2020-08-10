function ItemMovimentoGeralDAO(connection) {
    this._connection = connection;
    this._table = `tb_item_movimento_geral`;
}

ItemMovimentoGeralDAO.prototype.salva = async function(obj) {
    const novoItemMovimentoGeral = await this._connection.query(`INSERT INTO tb_item_movimento_geral (idMovimentoGeral, idMaterial, idFabricante, lote, validade, 
                                                         quantidade, idItemReceita, itemSolicitacaoRemanejamento, situacao, idUsuarioCriacao, dataCriacao)
                                                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                                                          [obj.idMovimentoGeral, obj.idMaterial, obj.idFabricante,
                                                            obj.lote, new Date(obj.validade), obj.quantidade, obj.idItemReceita, 
                                                            obj.itemSolicitacaoRemanejamento,
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

ItemMovimentoGeralDAO.prototype.buscarPorMovimento = async function(idMovimentoGeral) {   
    const itemMovimentoGeral = await  this._connection.query(`select 
                                                        item_movto.id,
                                                        material.id as idMaterial,
                                                        material.codigo,
                                                        material.descricao nomeMaterial,
                                                        item_movto.idFabricante, 
                                                        fabricante.nome nomeFabricante, 
                                                        item_movto.lote, 		
                                                        item_movto.validade, 
                                                        item_movto.quantidade,
                                                        0 as itemSelecionado
                                                    from tb_item_movimento_geral item_movto    
                                                    inner join tb_movimento_geral movto   on movto.id = item_movto.idMovimentoGeral    
                                                    inner join tb_material material on material.id = item_movto.idMaterial     
                                                    inner join tb_fabricante_material fabricante on item_movto.idFabricante = fabricante.id    
                                                    inner join tb_tipo_movimento tipo_movto on tipo_movto.id = movto.idTipoMovimento
                                                    where item_movto.idMovimentoGeral=? and tipo_movto.movimentoAdministrativo=1`,[idMovimentoGeral]);
                                                    
    return itemMovimentoGeral;
}

ItemMovimentoGeralDAO.prototype.buscarReservaRemanejamento = async function(idSolicitacaoRemanejamento, idItemSolicitacaoRemanejamento) {   
    const itemMovimentoGeral = await  this._connection.query(`select 
                                                            item_movto.id,
                                                            item_movto.itemSolicitacaoRemanejamento,
                                                            material.id as idMaterial,
                                                            material.codigo,
                                                            material.descricao nomeMaterial,
                                                            item_movto.idFabricante, 
                                                            fabricante.nome nomeFabricante, 
                                                            item_movto.lote, 		
                                                            item_movto.validade, 
                                                            item_movto.quantidade,
                                                            0 as itemSelecionado
                                                        from tb_item_movimento_geral item_movto    
                                                        inner join tb_movimento_geral movto   on movto.id = item_movto.idMovimentoGeral    
                                                        inner join tb_material material on material.id = item_movto.idMaterial     
                                                        inner join tb_fabricante_material fabricante on item_movto.idFabricante = fabricante.id    
                                                        inner join tb_tipo_movimento tipo_movto on tipo_movto.id = movto.idTipoMovimento
                                                        inner join tb_item_solicitacao_remanejamento item_remjto on item_remjto.id = item_movto.itemSolicitacaoRemanejamento
                                                        where item_remjto.idSolicitacaoRemanejamento=?
                                                        and item_remjto.id = ? and tipo_movto.id=4 `,[idSolicitacaoRemanejamento, idItemSolicitacaoRemanejamento]);
                                                    
    return itemMovimentoGeral;
}

module.exports = function(){
    return ItemMovimentoGeralDAO;
};