function ItemPedidoCompraDAO(connection) {
    this._connection = connection;
    this._table = `tb_item_pedido_compra`;
}

ItemPedidoCompraDAO.prototype.salva = async function(obj) {
    const result = await this._connection.query(`INSERT INTO tb_item_pedido_compra 
            (idPedidoCompra, idMaterial, qtdCompra, dataPrevistaEntrega, situacao, idUsuarioCriacao, dataCriacao) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`, 
        [obj.idPedidoCompra, obj.idMaterial, obj.qtdCompra, new Date(obj.dataPrevistaEntrega), obj.situacao, obj.idUsuarioCriacao, obj.dataCriacao]);
    return [result];
}

ItemPedidoCompraDAO.prototype.atualiza = async function(obj) {        
    const result =  await this._connection.query(`UPDATE tb_item_pedido_compra 
                    SET idPedidoCompra = ?, idMaterial = ?, saldoEntregue = ?, dataUltimaEntrega = ?,  
                    situacao = ?, idUsuarioAlteracao = ?, dataAlteracao  = ? WHERE id= ?`,
                    [obj.idPedidoCompra, obj.idMaterial, obj.saldoEntregue, obj.dataUltimaEntrega ? new Date(obj.dataUltimaEntrega) : null,
                    obj.situacao, obj.idUsuarioAlteracao, obj.dataAlteracao, obj.id]);
    return [result];
}

ItemPedidoCompraDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}

ItemPedidoCompraDAO.prototype.buscarPorPedidoCompra = async function(idPedidoCompra) {   
    const itemReceita = await  this._connection.query(`SELECT
                                a.id
                                ,a.idPedidoCompra
                                ,a.idMaterial
                                ,material.descricao nomeMaterial
                                ,material.codigo codigoMaterial
                                ,a.qtdCompra
                                ,a.saldoEntregue
                                ,a.dataPrevistaEntrega                                                                
                                ,a.dataUltimaEntrega
                                ,a.situacao 
                                ,UUID() as idFront                              
                                FROM ${this._table} a
                                INNER JOIN tb_material material ON (a.idMaterial = material.id)
                                WHERE a.situacao > 0 and a.idPedidoCompra=?`,idPedidoCompra);
    return itemReceita;
}


ItemPedidoCompraDAO.prototype.carregaItemPorEmpenhoMaterial = async function(idPedidoCompra, idMaterial) {   
    const itemReceita = await  this._connection.query(`SELECT
                                a.id
                                ,a.idPedidoCompra
                                ,a.idMaterial                                   
                                ,a.dataUltimaEntrega
                                ,a.situacao 
                                ,a.saldoEntregue
                                ,UUID() as idFront                              
                                FROM ${this._table} a
                                INNER JOIN tb_pedido_compra pedido ON (a.idPedidoCompra = pedido.id)
                                INNER JOIN tb_material material ON (a.idMaterial = material.id)
                                WHERE a.situacao > 0 and pedido.id=? and a.idMaterial=?`,[idPedidoCompra,idMaterial]);
    return itemReceita;
}

module.exports = function(){
    return ItemPedidoCompraDAO;
};