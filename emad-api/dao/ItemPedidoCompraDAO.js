function ItemPedidoCompraDAO(connection) {
    this._connection = connection;
    this._table = `tb_item_pedido_compra`;
}

ItemPedidoCompraDAO.prototype.salva = function(obj, callback) {
    this._connection.query(`INSERT INTO ${this._table} SET ?`, obj, callback);
}

ItemPedidoCompraDAO.prototype.atualiza = function(obj, id, callback) {
    this._connection.query(`UPDATE ${this._table} SET ? WHERE id= ?`, [obj, id], callback);
}

ItemPedidoCompraDAO.prototype.buscaPorId = function (id, callback) {
    this._connection.query(`SELECT * FROM ${this._table} WHERE id = ?`,id,callback);
}

ItemPedidoCompraDAO.prototype.buscaDominio = function (callback) {
    this._connection.query(`SELECT id, nome FROM ${this._table} WHERE situacao = 1`, callback);
}

ItemPedidoCompraDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}

ItemPedidoCompraDAO.prototype.lista = function(callback) {   
    this._connection.query(`SELECT
                             a.id
                            ,a.idPedidoCompra
                            ,pedidoCompra.nome nomePedidoCompra
                            ,a.idMaterial
                            ,material.nome nomeMaterial
                            ,a.qtdCompra
                            ,a.saldoEntregue
                            ,a.dataPrevistaEntrega
                            ,a.dataUltimaEntrega
                            ,a.situacao
                            FROM ${this._table} a
                            INNER JOIN tb_pedido_compra pedidoCompra ON (a.idPedidoCompra = pedidoCompra.id)
                            INNER JOIN tb_material material ON (a.idMaterial = material.id)
                            WHERE a.situacao = 1`, callback);
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
                                FROM ${this._table} a
                                INNER JOIN tb_material material ON (a.idMaterial = material.id)
                                WHERE a.situacao > 0 and a.idPedidoCompra=?`,idPedidoCompra);
    return itemReceita;
}

module.exports = function(){
    return ItemPedidoCompraDAO;
};