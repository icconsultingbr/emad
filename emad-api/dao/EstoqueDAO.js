function EstoqueDAO(connection) {
    this._connection = connection;
    this._table = `tb_estoque`;
}

EstoqueDAO.prototype.salva = function(obj, callback) {
    this._connection.query(`INSERT INTO ${this._table} SET ?`, obj, callback);
}

EstoqueDAO.prototype.salvaSync = async function(obj, callback) {
    const estoqueCriado =  await this._connection.query(`INSERT INTO ${this._table} SET ?`, [obj]);
    return [estoqueCriado];
}

EstoqueDAO.prototype.atualiza = function(obj, id, callback) {
    this._connection.query(`UPDATE ${this._table} SET ? WHERE id= ?`, [obj, id], callback);
}

EstoqueDAO.prototype.buscaPorId = function (id, callback) {
    this._connection.query(`SELECT 
                                a.id
                                ,a.idFabricanteMaterial                                
                                ,a.idMaterial                                
                                ,a.idEstabelecimento                                
                                ,a.lote                            
                                ,DATE_FORMAT(a.validade,'%d/%m/%Y') as validade
                                ,a.quantidade
                                ,a.bloqueado
                                ,a.motivoBloqueio
                                ,a.dataBloqueio
                                ,a.idUsuarioBloqueio                                
                                ,a.situacao    
    FROM ${this._table} a WHERE id = ?`,id,callback);
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

EstoqueDAO.prototype.carregaQuantidadePorMaterialEstabelecimentoLote = async function(obj){
    let quantidade =  await this._connection.query(`select sum(quantidade) as quantidade from tb_estoque where idMaterial = ? and idEstabelecimento = ? and idFabricanteMaterial=? and lote=?`, [obj.idMaterial, obj.idEstabelecimento, obj.idFabricante, obj.lote]);
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

EstoqueDAO.prototype.carregaEstoquePorMaterialBloqueado = async function(obj){
    let estoque =  await this._connection.query(`select e.*
                                                from
                                                        tb_estoque e 
                                                        inner join tb_material m on e.idMaterial = m.id
                                                where
                                                        e.idMaterial = ?                                                        
                                                        and e.lote = ?
                                                        and e.idFabricanteMaterial = ?
                                                        and bloqueado = 1`, [obj.idMaterial, obj.lote, obj.idFabricanteMaterial]);
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

EstoqueDAO.prototype.carregaEstoquePorUnidade = async function(idEstabelecimento, addFilter){
    let where = "";
    
    if(addFilter != null){   
        if (addFilter.nomeMaterial && addFilter.nomeMaterial != "undefined") {            
            where+=" AND UPPER( mat.descricao) LIKE '%"+addFilter.nomeMaterial.toUpperCase()+"%'";
        }      
        
        if (addFilter.nomeLote && addFilter.nomeLote != "undefined") {
            where+=" AND UPPER(est.lote) LIKE '%"+addFilter.nomeLote.toUpperCase()+"%'";
        } 
    }

    let estoque =  await this._connection.query(`select mat.codigo as codigo, 
                                                        mat.descricao as medicamento,
                                                        sum(est.quantidade) as estoque, 
                                                        est.idMaterial as idMaterial,
                                                        (select COUNT(1) from tb_estoque estBloq where estBloq.idMaterial= est.idMaterial and estBloq.bloqueado=1) lote_com_bloqueio,
                                                        (select COUNT(1) from tb_estoque estBloq where estBloq.idMaterial= est.idMaterial and estBloq.validade<=now()) lote_com_vencidos,
                                                        (select max(estBloq.dataAlteracao) from tb_estoque estBloq where estBloq.idMaterial= est.idMaterial) data_movimento
                                                    from tb_estoque est
                                                    inner join tb_material mat on est.idMaterial = mat.id
                                                    inner join tb_estabelecimento und on est.idEstabelecimento = und.id
                                                    where mat.situacao = 1
                                                    and mat.dispensavel = true
                                                    and und.situacao = 1 and est.idEstabelecimento = ?
                                                    ${where}
                                                    group by  mat.codigo , mat.descricao , est.idMaterial `, [idEstabelecimento]);
    return estoque;
}

EstoqueDAO.prototype.carregaEstoquePorUnidadeDetalhe = async function(idMaterial, idEstabelecimento){
    let estoque =  await this._connection.query(`select mat.codigo as codigoMaterial, 
                                                        mat.descricao as nomeMaterial,
                                                        est.quantidade as estoque, est.idMaterial as cod_material,
                                                        est.bloqueado,
                                                        est.validade<=now() vencido,
                                                        est.lote ,
                                                        fabricanteMaterial.nome nomeFabricanteMaterial,
                                                        est.validade,
                                                        mat.generico
                                                    from tb_estoque est
                                                    inner join tb_material mat on est.idMaterial = mat.id
                                                    inner join tb_estabelecimento und on est.idEstabelecimento = und.id
                                                    INNER JOIN tb_fabricante_material fabricanteMaterial ON (est.idFabricanteMaterial = fabricanteMaterial.id)
                                                    where mat.situacao = 1 and mat.dispensavel = true and und.situacao = 1 
                                                    and est.idMaterial = ?  and est.idEstabelecimento= ? `, [idMaterial, idEstabelecimento] );
    return estoque;
}

EstoqueDAO.prototype.carregaEstoquePorMedicamento = async function(idMaterial){
    let estoque =  await this._connection.query(`select und.id as idEstabelecimento, und.nomeFantasia as nomeEstabelecimento,
                                                        mat.codigo as codigo, 
                                                        mat.descricao as medicamento,
                                                        sum(est.quantidade) as estoque, 
                                                        est.idMaterial as idMaterial,
                                                        (select COUNT(1) from tb_estoque estBloq where estBloq.idMaterial= est.idMaterial and estBloq.bloqueado=1) lote_com_bloqueio,
                                                        (select COUNT(1) from tb_estoque estBloq where estBloq.idMaterial= est.idMaterial and estBloq.validade<=now()) lote_com_vencidos,
                                                        (select max(estBloq.dataAlteracao) from tb_estoque estBloq where estBloq.idMaterial= est.idMaterial) data_movimento
                                                    from tb_estoque est
                                                    inner join tb_material mat on est.idMaterial = mat.id
                                                    inner join tb_estabelecimento und on est.idEstabelecimento = und.id
                                                    where mat.situacao = 1
                                                    and mat.dispensavel = true
                                                    and und.situacao = 1 and mat.id = ?                                                    
                                                    group by  und.id, und.nomeFantasia, mat.codigo , mat.descricao , est.idMaterial `, [idMaterial]);
    return estoque;
}

EstoqueDAO.prototype.carregaEstoquePorConsumo = async function(idMaterial, idEstabelecimento, addFilter){
    let where = "";    
    if(addFilter != null){   
        if (addFilter.estoqueAbaixoMinimo && addFilter.estoqueAbaixoMinimo == "S") {            
            where+=" AND (SELECT SUM(quantidade) FROM tb_estoque WHERE idMaterial = m.id and idEstabelecimento=" + idEstabelecimento + ") <= m.estoqueMinimo ";
        }      
    }

    if (idMaterial && idMaterial != "undefined" && idMaterial > 0) {
        where += " AND m.id = '" + idMaterial + "'";
    } 

    let estoque =  await this._connection.query(`SELECT m.codigo as codigoMaterial, m.descricao as nomeMaterial, m.estoqueMinimo ,
                                                @estoque:=(SELECT SUM(quantidade) FROM tb_estoque WHERE idMaterial = m.id and idEstabelecimento=?) as estoque,
                                                @comprar:=(0-0) as comprar,
                                                @dispensar:=(0) as dispensar,
                                                (IF(@estoque > 0,@estoque,0)+IF(@comprar > 0,@comprar,0)-IF(@dispensar > 0,@dispensar,0))  as saldo
                                                FROM tb_material m                                                
                                                WHERE 
                                                m.situacao = true
                                                AND (SELECT SUM(quantidade) FROM tb_estoque WHERE idMaterial = m.id and idEstabelecimento=?) > 0                                                
                                                ${where} `, [idEstabelecimento, idEstabelecimento]);
    return estoque;
}

EstoqueDAO.prototype.carregaEstoqueLotePorMaterial = async function(idMaterial, idEstabelecimento, addFilter){
    let where = "";    

    if(addFilter != null){      
        if (addFilter.loteBloqueado && addFilter.loteBloqueado == "1") {            
            where+=" and est.bloqueado = 2 "; //SIM
        }
        else{
            where+=" and est.bloqueado <> 2 "; 
        }      

        if (addFilter.loteVencido && addFilter.loteVencido == "1") {            
            where+=" and est.validade <= NOW() "; //SIM
        }
        else{
            where+=" and est.validade >= NOW() "; 
        }  

        if (addFilter.operacao && addFilter.operacao != "1") {            
            where+=" and est.quantidade > 0 "; // diferente de entrada
        }
    }

    let estoque =  await this._connection.query(`select 
                                                    distinct est.lote, 
                                                    est.validade, 
                                                    est.quantidade, 
                                                    fab.id idFabricante,  
                                                    fab.nome nomeFabricanteMaterial,                                                   
                                                    concat('Lote: ',est.lote,' --- Validade: ', DATE_FORMAT(est.validade, '%d/%m/%Y'), ' --- Fabricante: ', fab.nome, ' --- Quantidade: ', cast(est.quantidade as  UNSIGNED INTEGER))  nome
                                                from tb_estoque est
                                                    inner join tb_material mat on est.idMaterial = mat.id
                                                    inner join tb_fabricante_material fab on est.idFabricanteMaterial = fab.id
                                                    where est.idMaterial = ?
                                                    and est.idEstabelecimento = ?
                                                    and mat.situacao = 1
                                                    ${where}
                                                order by est.validade
                                                `, [idMaterial, idEstabelecimento]);
    return estoque;
}

module.exports = function(){
    return EstoqueDAO;
};