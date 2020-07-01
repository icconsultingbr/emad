function EstoqueDAO(connection) {
    this._connection = connection;
    this._table = `tb_estoque`;
}

EstoqueDAO.prototype.salva = function(obj, callback) {
    this._connection.query(`INSERT INTO ${this._table} SET ?`, obj, callback);
}

EstoqueDAO.prototype.atualiza = function(obj, id, callback) {
    this._connection.query(`UPDATE ${this._table} SET ? WHERE id= ?`, [obj, id], callback);
}

EstoqueDAO.prototype.buscaPorId = function (id, callback) {
    this._connection.query(`SELECT * FROM ${this._table} WHERE id = ?`,id,callback);
}

EstoqueDAO.prototype.buscaDominio = function (callback) {
    this._connection.query(`SELECT id, nome FROM ${this._table} WHERE situacao = 1`, callback);
}

EstoqueDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}

EstoqueDAO.prototype.carregaQuantidadePorMaterialEstabelecimento = async function(obj){
    let quantidade =  await this._connection.query(`select sum(quantidade) as quantidade from tb_estoque where idMaterial = ? and idEstabelecimento = ?`, [obj.idMaterial, obj.idEstabelecimento]);
    return quantidade[0].quantidade ? quantidade[0].quantidade : 0;
}

EstoqueDAO.prototype.carregaEstoquePorMaterial = async function(obj){
    let estoque =  await this._connection.query(`select e.id,
                                                        e.idFabricanteMaterial ,
                                                        e.idMaterial ,
                                                        e.idEstabelecimento ,
                                                        e.lote,
                                                        e.validade,
                                                        e.quantidade,
                                                        e.bloqueado ,
                                                        e.motivoBloqueio ,
                                                        m.descricao nomeMaterial
                                                from
                                                        tb_estoque e 
                                                        inner join tb_material m on e.idMaterial = m.id
                                                where
                                                        e.idMaterial = ?
                                                        and e.idEstabelecimento = ?
                                                        and e.lote = ?
                                                        and e.idFabricanteMaterial = ?`, [obj.idMaterial, obj.idEstabelecimento, obj.lote, obj.idFabricanteMaterial]);
    return estoque;
}

EstoqueDAO.prototype.atualizaQuantidadeEstoque = async function(qtdDispensar, idUsuario, id){
    const estoqueAtualizado =  await this._connection.query(`UPDATE tb_estoque SET quantidade = ?, idUsuarioAlteracao = ?, dataAlteracao = NOW() WHERE id= ?`, [qtdDispensar, idUsuario, id]);
    return [estoqueAtualizado];
}

EstoqueDAO.prototype.lista = function(addFilter, callback) {   
    let where = "";

    if(addFilter != null){   
        if (addFilter.idMaterial && addFilter.idMaterial != "undefined") {
            where+=" AND a.idMaterial = " + addFilter.idMaterial + "";
        }      
        
        if (addFilter.idEstabelecimento && addFilter.idEstabelecimento != "undefined") {
            where+=" AND a.idEstabelecimento = " + addFilter.idEstabelecimento + "";
        } 
    }

    this._connection.query(`SELECT
                            a.id
                            ,a.idFabricanteMaterial
                            ,fabricanteMaterial.nome nomeFabricanteMaterial
                            ,a.idMaterial
                            ,material.descricao nomeMaterial
                            ,a.idEstabelecimento
                            ,estabelecimento.nomeFantasia nomeEstabelecimento
                            ,a.lote
                            ,a.validade
                            ,a.quantidade
                            ,a.bloqueado
                            ,a.motivoBloqueio
                            ,a.dataBloqueio
                            ,a.idUsuarioBloqueio
                            ,usuario.nome nomeUsuario
                            ,a.situacao
                            ,case when  a.validade < NOW() then true else false end as vencido
                            FROM ${this._table} a
                            INNER JOIN tb_fabricante_material fabricanteMaterial ON (a.idFabricanteMaterial = fabricanteMaterial.id)
                            INNER JOIN tb_material material ON (a.idMaterial = material.id)
                            INNER JOIN tb_estabelecimento estabelecimento ON (a.idEstabelecimento = estabelecimento.id)
                            LEFT JOIN tb_usuario usuario ON (a.idUsuarioBloqueio = usuario.id)
                            WHERE a.situacao = 1  ${where} `, callback);
}

module.exports = function(){
    return EstoqueDAO;
};