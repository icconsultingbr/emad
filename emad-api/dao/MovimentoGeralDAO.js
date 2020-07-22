function MovimentoGeralDAO(connection) {
    this._connection = connection;
    this._table = `tb_movimento_geral`;
}

MovimentoGeralDAO.prototype.salva = async function(obj) {
    const novoMovimentoGeral = await this._connection.query(`INSERT INTO tb_movimento_geral (idTipoMovimento, idUsuario, idEstabelecimento, idReceita, idPaciente, 
                                                            numeroDocumento, numeroEmpenho, dataMovimento, numeroControle, situacao, idUsuarioCriacao, dataCriacao)
                                                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                                                          [obj.idTipoMovimento, obj.idUsuario, obj.idEstabelecimento,
                                                            obj.idReceita, obj.idPaciente, obj.numeroDocumento, obj.numeroEmpenho, obj.dataMovimento, 
                                                            obj.numeroControle, obj.situacao, obj.idUsuarioCriacao, obj.dataCriacao]);                                                            
    return [novoMovimentoGeral];
}

MovimentoGeralDAO.prototype.carregaRelatorioEntradaMaterial = async function(idMovimento){
    let estoque =  await this._connection.query(`select 
                                                material.codigo as codigoMaterial,
                                                material.descricao as nomeMaterial, 
                                                fabricante.nome as nomeFabricanteMaterial,
                                                item.lote, 
                                                DATE_FORMAT(item.validade,'%d/%m/%Y') as validade, 
                                                item.quantidade
                                                from tb_movimento_geral movimento 
                                                inner join tb_item_movimento_geral item on item.idMovimentoGeral = movimento.id
                                                inner join tb_fabricante_material fabricante on fabricante.id = item.idFabricante 
                                                inner join tb_material material on material.id = item.idMaterial 
                                                where movimento.id=? `, [idMovimento]);
    return estoque;
}

module.exports = function(){
    return MovimentoGeralDAO;
};


