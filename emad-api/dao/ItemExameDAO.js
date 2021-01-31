const { async } = require("q");

function ItemExameDAO(connection) {
    this._connection = connection;
    this._table = `tb_item_exame`;
}

ItemExameDAO.prototype.salva = async function(itemExame) {
    const novoItemExame = await this._connection.query(`INSERT INTO tb_item_exame (idExame, idProdutoExame, idMetodoExame, resultado, situacao, 
                                                         idUsuarioCriacao, dataCriacao)
                                                          VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                                                          [itemExame.idExame, itemExame.idProdutoExame, itemExame.idMetodoExame, itemExame.resultado,
                                                            itemExame.situacao, itemExame.idUsuarioCriacao, itemExame.dataCriacao]);

    return [novoItemExame];
}

ItemExameDAO.prototype.atualiza = async function(itemExame) {
    const itemExameAtualizado = await this._connection.query(`UPDATE tb_item_exame SET idExame=?, idProdutoExame=?, idMetodoExame=?, resultado=?, 
                                                            situacao=?, idUsuarioAlteracao=?, dataAlteracao=? 
                                                            WHERE id=?`, 
                                                          [ itemExame.idExame, itemExame.idProdutoExame, itemExame.idMetodoExame,
                                                            itemExame.resultado, itemExame.situacao, itemExame.idUsuarioAlteracao, itemExame.dataAlteracao, itemExame.id]);

    return [itemExameAtualizado];
}

ItemExameDAO.prototype.buscarPorExame = async function(idExame) {   
    const response = await  this._connection.query(`SELECT
                                a.id
                                ,a.idExame
                                ,a.idProdutoExame
                                ,a.idMetodoExame
                                ,a.resultado
                                ,a.situacao
                                ,CASE WHEN a.resultado = 1 then 'Amostra não reagente'
                                      WHEN a.resultado = 2 then 'Amostra reagente'
                                      WHEN a.resultado = 3 then 'Não realizado'
                                END nomeResultado
                                ,produto.nome nomeProdutoExame
                                ,metodo.nome nomeMetodoExame
                                FROM ${this._table} a
                                INNER JOIN tb_produto_exame produto ON (a.idProdutoExame = produto.id)
                                INNER JOIN tb_metodo_exame metodo ON (a.idMetodoExame = metodo.id)                                
                                WHERE a.situacao > 0 and a.idExame=?`,idExame);

    return response;
}

module.exports = function(){
    return ItemExameDAO;
};