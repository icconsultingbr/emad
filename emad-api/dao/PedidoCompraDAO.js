const QueryBuilder = require('../infrastructure/QueryBuilder');

function PedidoCompraDAO(connection) {
    this._connection = connection;
    this._table = `tb_pedido_compra`;
}

PedidoCompraDAO.prototype.salva = async function(obj) {
    const result = await this._connection.query(`INSERT INTO tb_pedido_compra (numeroPedido, numeroEmpenho, dataPedido, dataEmpenho, status, 
                                                    situacao, idUsuarioCriacao, dataCriacao) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
        [obj.numeroPedido, obj.numeroEmpenho, new Date(obj.dataPedido), 
         new Date(obj.dataEmpenho), obj.status, obj.situacao, obj.idUsuarioCriacao, obj.dataCriacao]);
    return [result];
}

PedidoCompraDAO.prototype.atualiza = async function(obj, id) {        
    const result =  await this._connection.query(`UPDATE tb_pedido_compra 
                    SET numeroPedido = ?, numeroEmpenho = ?, dataPedido = ?, dataEmpenho = ?,  
                    situacao = ?, status = ?, idUsuarioAlteracao = ?, dataAlteracao  = ? WHERE id= ?`,
                    [obj.numeroPedido, obj.numeroEmpenho, obj.dataPedido ? new Date(obj.dataPedido) : null, 
                        obj.dataEmpenho ? new Date(obj.dataEmpenho) : null , obj.situacao, obj.status, obj.idUsuarioAlteracao, obj.dataAlteracao, id]);
    return [result];
}

PedidoCompraDAO.prototype.buscaPorId = async function (id) {
    const result = await this._connection.query(`SELECT * FROM ${this._table} WHERE id = ?`,id);    
    return result;
}

PedidoCompraDAO.prototype.deletaPorId =  async function (id) {
    const result = await this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id);    
    return [result];
}

PedidoCompraDAO.prototype.lista = async function(sortColumn, sortOrder) {  
    const query = QueryBuilder.sort(`SELECT
                                    a.id
                                    ,a.numeroPedido
                                    ,a.numeroEmpenho
                                    ,a.dataPedido
                                    ,a.dataEmpenho
                                    ,a.status
                                    ,a.situacao
                                    FROM ${this._table} a
                                    WHERE a.situacao = 1`, sortColumn, sortOrder);
    const result = await this._connection.query(query);
    return result;    
}

PedidoCompraDAO.prototype.listaEmpenho = async function() {   
    const result = await this._connection.query(`SELECT a.id, a.numeroEmpenho nome
                                                FROM ${this._table} a
                                                WHERE a.situacao = 1`);    
    return result;    
}

module.exports = function(){
    return PedidoCompraDAO;
};