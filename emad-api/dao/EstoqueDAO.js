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