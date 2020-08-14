function MaterialDAO(connection) {
    this._connection = connection;
    this._table = `tb_material`;
}

MaterialDAO.prototype.salva = function(obj, callback) {
    this._connection.query(`INSERT INTO ${this._table} SET ?`, obj, callback);
}

MaterialDAO.prototype.atualiza = function(obj, id, callback) {
    this._connection.query(`UPDATE ${this._table} SET ? WHERE id= ?`, [obj, id], callback);
}

MaterialDAO.prototype.buscaPorId = function (id, callback) {
    this._connection.query(`SELECT * FROM ${this._table} WHERE id = ?`,id,callback);
}

MaterialDAO.prototype.buscaDominio = function (callback) {
    this._connection.query(`SELECT id, nome FROM ${this._table} WHERE situacao = 1`, callback);
}

MaterialDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}

MaterialDAO.prototype.lista = function(callback) {   
    this._connection.query(`SELECT
                             a.id
                            ,a.codigo
                            ,a.descricao
                            ,a.idUnidadeMaterial
                            ,unidadeMaterial.nome nomeUnidadeMaterial
                            ,a.dispensavel
                            ,a.periodoDispensavel
                            ,a.necessitaAutorizacao
                            ,a.estoqueMinimo
                            ,a.generico
                            ,a.idListaControleEspecial
                            ,listaControleEspecial.listaControleEspecial as nomeListaControleEspecial
                            ,a.idGrupoMaterial
                            ,grupoMaterial.nome nomeGrupoMaterial
                            ,a.idSubGrupoMaterial
                            ,subGrupoMaterial.nome nomeSubGrupoMaterial
                            ,a.idFamiliaMaterial
                            ,familiaMaterial.nome nomeFamiliaMaterial
                            ,a.idTipoMaterial
                            ,tipoMaterial.nome nomeTipoMaterial
                            ,a.descricaoCompleta
                            ,a.situacao
                            FROM ${this._table} a
                            INNER JOIN tb_unidade_material unidadeMaterial ON (a.idUnidadeMaterial = unidadeMaterial.id)
                            LEFT JOIN tb_lista_controle_especial listaControleEspecial ON (a.idListaControleEspecial = listaControleEspecial.id)
                            LEFT JOIN tb_grupo_material grupoMaterial ON (a.idGrupoMaterial = grupoMaterial.id)
                            LEFT JOIN tb_sub_grupo_material subGrupoMaterial ON (a.idSubGrupoMaterial = subGrupoMaterial.id)
                            LEFT JOIN tb_familia_material familiaMaterial ON (a.idFamiliaMaterial = familiaMaterial.id)
                            LEFT JOIN tb_tipo_material tipoMaterial ON (a.idTipoMaterial = tipoMaterial.id)
                            WHERE a.situacao = 1`, callback);
}

MaterialDAO.prototype.listaPorDescricao = function(addFilter, callback) {      
    let where = "";

    if(addFilter != null){   
        if (addFilter.descricao) {
            where+=" AND UPPER(a.descricao) LIKE '%"+addFilter.descricao.toUpperCase()+"%'";
        }
        
        if (addFilter.idGrupoMaterial && addFilter.idGrupoMaterial != "undefined") {
            where+=" AND a.idGrupoMaterial = " + addFilter.idGrupoMaterial + "";
        } 
    }

    this._connection.query(`SELECT
                             a.id
                            ,a.codigo
                            ,a.descricao
                            ,a.idUnidadeMaterial
                            ,unidadeMaterial.nome nomeUnidadeMaterial
                            FROM ${this._table} a
                            INNER JOIN tb_unidade_material unidadeMaterial ON (a.idUnidadeMaterial = unidadeMaterial.id)
                            WHERE a.situacao = 1 ${where} 
                            ORDER BY a.id DESC`, callback);
}

MaterialDAO.prototype.listaPorDescricaoProfissionalEspecialidade = function(addFilter, idProfissional, callback) {      
    let where = "";

    if(addFilter != null){   
        if (addFilter.descricao  && addFilter.descricao != "undefined") {
            where+=" AND UPPER(a.descricao) LIKE '%"+addFilter.descricao.toUpperCase()+"%'";
        }

        if (addFilter.idGrupoMaterial && addFilter.idGrupoMaterial != "undefined") {
            where+=" AND a.idGrupoMaterial = " + addFilter.idGrupoMaterial + "";
        }       
    }

    this._connection.query(`SELECT
                             a.id
                            ,a.codigo
                            ,a.descricao
                            ,a.descricaoCompleta
                            ,a.idUnidadeMaterial
                            ,unidadeMaterial.nome nomeUnidadeMaterial
                            ,espec.id autorizado
                            ,a.dispensavel
                            FROM ${this._table} a
                            INNER JOIN tb_unidade_material unidadeMaterial ON (a.idUnidadeMaterial = unidadeMaterial.id)
                            INNER JOIN tb_profissional profissional ON (profissional.situacao = 1 and profissional.id=${idProfissional})
                            LEFT JOIN tb_especialidade_material espec ON (a.id = espec.idMaterial and espec.situacao = 1 and espec.idEspecialidade = profissional.idEspecialidade)                            
                            WHERE a.situacao = 1 ${where} 
                            ORDER BY a.descricao asc`, callback);
}

MaterialDAO.prototype.listaPorDescricaoUsuarioEspecialidade = function(addFilter, idUsuario, callback) {      
    let where = "";

    if(addFilter != null){   
        if (addFilter.descricao  && addFilter.descricao != "undefined") {
            where+=" AND UPPER(a.descricao) LIKE '%"+addFilter.descricao.toUpperCase()+"%'";
        }

        if (addFilter.idGrupoMaterial && addFilter.idGrupoMaterial != "undefined") {
            where+=" AND a.idGrupoMaterial = " + addFilter.idGrupoMaterial + "";
        }       
    }

    this._connection.query(`SELECT
                             a.id
                            ,a.codigo
                            ,a.descricao
                            ,a.descricaoCompleta
                            ,a.idUnidadeMaterial
                            ,unidadeMaterial.nome nomeUnidadeMaterial
                            ,espec.id autorizado
                            ,a.dispensavel
                            FROM ${this._table} a
                            INNER JOIN tb_unidade_material unidadeMaterial ON (a.idUnidadeMaterial = unidadeMaterial.id)                            
                            INNER JOIN tb_profissional profissional ON (profissional.situacao = 1 and profissional.idUsuario=${idUsuario})
                            LEFT JOIN tb_especialidade_material espec ON (a.id = espec.idMaterial and espec.situacao = 1 and espec.idEspecialidade = profissional.idEspecialidade)                            
                            WHERE a.situacao = 1 ${where} 
                            ORDER BY a.descricao asc`, callback);
}

MaterialDAO.prototype.carregaMedicamentoPorPaciente = async function(idPaciente, addFilter, unidade){
    let where = "";
    let orderBy = "  ";

    if(addFilter != null){   
        if (addFilter.idEstabelecimento && addFilter.idEstabelecimento != "undefined" && addFilter.idEstabelecimento != "null") {
            where+=" AND mvg.idEstabelecimento = " + addFilter.idEstabelecimento + "";
        }

        if (addFilter.idMaterial && addFilter.idMaterial != "undefined") {
            where+=" AND img.idMaterial = " + addFilter.idMaterial + "";
        }   
        
        if (addFilter.dataInicial && addFilter.dataFinal) {           
            where+=" AND mvg.dataMovimento >= '" + addFilter.dataInicial + " 00:00:00' AND mvg.dataMovimento <= '" + addFilter.dataFinal + " 23:59:59'";
        }

        if(addFilter.ordenadoPor){
            orderBy += " order by " + addFilter.ordenadoPor + " asc";
        }
    }
    let medicamento;

    if(unidade){
        medicamento =  await this._connection.query(`select 
                                                            distinct und.id idUnidade, 
                                                            und.nomeFantasia as unidadeNome, 
                                                            count(*) medicamentosPorUnidade , 
                                                            sum(img.quantidade) qtdRetirada
                                                        from tb_material mat
                                                            inner join tb_item_movimento_geral img on mat.id = img.idMaterial 
                                                            inner join tb_fabricante_material fab on img.idFabricante = fab.id
                                                            inner join tb_movimento_geral mvg on img.idMovimentoGeral = mvg.id
                                                            inner join tb_estabelecimento und on mvg.idEstabelecimento = und.id
                                                            inner join tb_paciente pac on mvg.idPaciente = pac.id
                                                            inner join tb_item_receita irc on img.idItemReceita = irc.id
                                                            inner join tb_receita rec on irc.idReceita = rec.id
                                                        where mat.situacao = 1
                                                            and mat.dispensavel = 1
                                                            and fab.situacao = 1
                                                            and und.situacao = 1
                                                            and pac.situacao = 1
                                                            ${where} 
                                                            and pac.id = ?
                                                            group by und.id
                                                            order by und.nomeFantasia desc`, [idPaciente]);
    }else{
        medicamento =  await this._connection.query(`select 
                                                    mat.codigo as codigoMaterial, 
                                                    mat.descricao as nomeMaterial,
                                                    img.lote as lote, 
                                                    fab.nome as nomeFabricanteMaterial, 
                                                    img.validade as validade,
                                                    img.quantidade as quantidade,
                                                    mvg.dataMovimento as dataMovimento,
                                                    CONCAT(rec.ano,'-',rec.idEstabelecimento ,'-',rec.numero) as numeroReceita
                                                from tb_material mat
                                                inner join tb_item_movimento_geral img on mat.id = img.idMaterial 
                                                inner join tb_fabricante_material fab on img.idFabricante = fab.id
                                                inner join tb_movimento_geral mvg on img.idMovimentoGeral = mvg.id
                                                inner join tb_estabelecimento und on mvg.idEstabelecimento = und.id
                                                inner join tb_paciente pac on mvg.idPaciente = pac.id
                                                inner join tb_item_receita irc on img.idItemReceita = irc.id
                                                inner join tb_receita rec on irc.idReceita = rec.id
                                                where mat.situacao = 1 and mat.dispensavel = 1 and fab.situacao = 1 and und.situacao = 1 and pac.situacao = 1 
                                                ${where} 
                                                and pac.id = ?
                                                ${orderBy} `, [idPaciente]);
    }
    
    
    return medicamento;
}

MaterialDAO.prototype.carregaMedicamentoPorProfissional = async function(idProfissional, addFilter, unidade){
    let where = "";
    let orderBy = " order by mat.descricao ";

    if(addFilter != null){   
        if (addFilter.idEstabelecimento && addFilter.idEstabelecimento != "undefined" && addFilter.idEstabelecimento != "null") {
            where+=" AND unid.id = " + addFilter.idEstabelecimento + "";
        }

        if (addFilter.idMaterial && addFilter.idMaterial != "undefined") {
            where+=" AND item.idMaterial = " + addFilter.idMaterial + "";
        }   
        
        if (addFilter.dataInicial && addFilter.dataFinal) {           
            where+=" AND (dataUltimaDispensacao IS NULL OR (dataUltimaDispensacao >= '" + addFilter.dataInicial + " 00:00:00' AND dataUltimaDispensacao <= '" + addFilter.dataFinal + " 23:59:59'))";
        }

        if(addFilter.ordenadoPor){
            orderBy += ", " + addFilter.ordenadoPor + " asc";
        }
    }
    let medicamento;

    if(unidade){
        medicamento =  await this._connection.query(`select distinct unid.id idUnidade, 
                                                        unid.nomeFantasia as unidadeNome,
                                                        sum(item.qtdPrescrita) as totalQtdPrescrita,
                                                        sum(item.qtdDispAnterior) as totalQtdDispensada
                                                    from tb_receita as rec              
                                                        inner join tb_item_receita as item on rec.id=item.idReceita
                                                        inner join tb_estabelecimento as unid on rec.idEstabelecimento =unid.id
                                                        inner join tb_profissional as prof on rec.idProfissional=prof.id
                                                        inner join tb_material as mat on mat.id = item.idMaterial 
                                                    where 
                                                        prof.situacao=1 and
                                                        unid.situacao=1 and
                                                        mat.situacao=1 and 
                                                        prof.id = ?
                                                        ${where}                                                                                                                 
                                                        group by unid.id
                                                        order by unid.nomeFantasia desc`, [idProfissional]);
    }else{
        medicamento =  await this._connection.query(`select mat.codigo codigoMaterial,
                                                            mat.descricao nomeMaterial,
                                                            sum(item.qtdPrescrita) as qtdPrescrita,
                                                            sum(item.qtdDispAnterior) as qtdDispensada,
                                                            max(rec.dataUltimaDispensacao) as dataUltimaDispensacao,
                                                            unid.nomeFantasia 
                                                    from tb_receita as rec              
                                                        inner join tb_item_receita as item on rec.id=item.idReceita
                                                        inner join tb_estabelecimento as unid on rec.idEstabelecimento =unid.id
                                                        inner join tb_profissional as prof on rec.idProfissional=prof.id
                                                        inner join tb_material as mat on mat.id = item.idMaterial 
                                                    where 
                                                        prof.situacao=1 and
                                                        unid.situacao=1 and
                                                        mat.situacao=1 and 
                                                        prof.id = ?
                                                        ${where} 
                                                    group by mat.codigo, mat.descricao, unid.nomeFantasia 
                                                    
                                                ${orderBy} `, [idProfissional]);
    }
    
    
    return medicamento;
}

MaterialDAO.prototype.carregaMedicamentoVencido = async function(addFilter){
    let where = "";
    let orderBy = " ";

    if(addFilter != null){   
        if (addFilter.idEstabelecimento && addFilter.idEstabelecimento != "undefined" && addFilter.idEstabelecimento != "null") {
            where+=" AND und.id = " + addFilter.idEstabelecimento + "";
        }

        if (addFilter.idMaterial && addFilter.idMaterial != "undefined") {
            where+=" AND mat.id = " + addFilter.idMaterial + "";
        }  

        if (addFilter.idFabricante && addFilter.idFabricante != "undefined") {
            where+=" AND est.idFabricanteMaterial = " + addFilter.idFabricante + "";
        }  
        
        if (addFilter.dataInicial && addFilter.dataFinal) {           
            where+=" AND validade >= '" + addFilter.dataInicial + " 00:00:00' AND validade <= '" + addFilter.dataFinal + " 23:59:59'";
        }

        if(addFilter.ordenadoPor){
            orderBy += " order by " + addFilter.ordenadoPor + " asc";
        }
    }
    let medicamento;

    medicamento =  await this._connection.query(`select mat.codigo as codigoMaterial, 
                                                    mat.descricao as nomeMaterial,
                                                    est.validade,
                                                    est.lote, fab.nome as nomeFabricanteMaterial, est.quantidade as estoque, und.nomeFantasia as unidade
                                                from tb_material mat
                                                inner join tb_estoque est on mat.id = est.idMaterial
                                                inner join tb_fabricante_material fab on est.idFabricanteMaterial = fab.id
                                                inner join tb_estabelecimento und on est.idEstabelecimento = und.id
                                                where mat.situacao = 1
                                                and mat.dispensavel = 1
                                                and fab.situacao = 1
                                                and und.situacao = 1
                                                and est.quantidade > 0
                                                ${where} 
                                                ${orderBy}`);   
    
    return medicamento;
}

MaterialDAO.prototype.carregaMedicamentoMovimentacao = async function(idTipoMovimento, addFilter, unidade){
    let where = "";
    let orderBy = "";

    if(addFilter != null){   
        if (addFilter.idEstabelecimento && addFilter.idEstabelecimento != "undefined" && addFilter.idEstabelecimento != "null") {
            where+=" AND und.id = " + addFilter.idEstabelecimento + "";
        }

        if (addFilter.idMaterial && addFilter.idMaterial != "undefined") {
            where+=" AND mat.id = " + addFilter.idMaterial + "";
        }  
        
        if (addFilter.dataInicial && addFilter.dataFinal) {           
            where+=" AND mvg.dataMovimento >= '" + addFilter.dataInicial + " 00:00:00' AND mvg.dataMovimento <= '" + addFilter.dataFinal + " 23:59:59'";
        }

        if(addFilter.ordenadoPor){
            orderBy += " order by " + addFilter.ordenadoPor + " asc";
        }
    }
    let medicamento;

    if(unidade){
        medicamento =  await this._connection.query(`select 
                                                            und.id idUnidade,
                                                            count(distinct mvg.id) as totalDocumentos, 
                                                            sum(img.quantidade) as totalQuantidade
                                                        from tb_material mat
                                                        inner join tb_item_movimento_geral img on mat.id = img.idMaterial 
                                                        inner join tb_fabricante_material fab on img.idFabricante = fab.id
                                                        inner join tb_movimento_geral mvg on img.idMovimentoGeral = mvg.id
                                                        inner join tb_estabelecimento und on mvg.idEstabelecimento = und.id
                                                        inner join tb_tipo_movimento tmv on mvg.idTipoMovimento = tmv.id
                                                        where mat.situacao = 1
                                                        and mat.dispensavel = 1
                                                        and fab.situacao = 1
                                                        and und.situacao = 1 
                                                        and tmv.id = ?
                                                        ${where}                                                                                                                 
                                                        group by und.id`, [idTipoMovimento]);
    }else{
        medicamento =  await this._connection.query(`select 
                                                        distinct tmv.nome as nomeTipoMovimento, 
                                                        und.nomeFantasia as unidade,
                                                        mvg.id as documento, 
                                                        mat.codigo as codigoMaterial, 
                                                        mat.descricao as nomeMaterial, 
                                                        img.lote,
                                                        fab.nome as nomeFabricanteMaterial, 
                                                        img.validade,
                                                        img.quantidade as quantidade, 
                                                        mvg.dataMovimento as dataMovimento,
                                                        mvg.motivo 
                                                    from tb_material mat
                                                    inner join tb_item_movimento_geral img on mat.id = img.idMaterial 
                                                    inner join tb_fabricante_material fab on img.idFabricante = fab.id
                                                    inner join tb_movimento_geral mvg on img.idMovimentoGeral = mvg.id
                                                    inner join tb_estabelecimento und on mvg.idEstabelecimento = und.id
                                                    inner join tb_tipo_movimento tmv on mvg.idTipoMovimento = tmv.id
                                                    where mat.situacao = 1
                                                    and mat.dispensavel = 1
                                                    and fab.situacao = 1
                                                    and und.situacao = 1 
                                                    and tmv.id = ?
                                                    ${where} 
                                                    ${orderBy}`, idTipoMovimento);
    }

    return medicamento;
}

MaterialDAO.prototype.carregaMedicamentoExtratoMovimento = async function(idMaterial, addFilter){
    let where = "";
    let orderBy = " order by movl.idMovimentoGeral asc, lote desc ";

    if(addFilter != null){   
        if (addFilter.idEstabelecimento && addFilter.idEstabelecimento != "undefined" && addFilter.idEstabelecimento != "null") {
            where+=" AND movt.idEstabelecimento  = " + addFilter.idEstabelecimento + "";
        }
        
        if (addFilter.dataInicial && addFilter.dataFinal) {           
            where+=" AND  movl.dataMovimentacao >= '" + addFilter.dataInicial + " 00:00:00' AND  movl.dataMovimentacao <= '" + addFilter.dataFinal + " 23:59:59'";
        }
    }
    let medicamento;

    medicamento =  await this._connection.query(`select movl.idMovimentoGeral,
                                                    imov.lote,
                                                    imov.quantidade ,
                                                    IFNULL(movl.saldoAnterior,0) saldoAnterior,
                                                    IFNULL(movl.quantidadeEntrada,0) quantidadeEntrada,
                                                    IFNULL(movl.quantidadeSaida,0) quantidadeSaida,
                                                    IFNULL(movl.quantidadePerda,0) quantidadePerda,
                                                    IFNULL(movl.saldoAtual,0) saldoAtual,
                                                    movl.dataMovimentacao,
                                                    movl.historico,
                                                    usr.nome nomeUsuario
                                                from tb_movimento_livro as movl
                                                    inner join tb_movimento_geral as movt on movt.id = movl.idMovimentoGeral
                                                    inner join tb_item_movimento_geral as imov on imov.idMovimentoGeral = movt.id
                                                    inner join tb_usuario as usr on movt.idUsuario = usr.id
                                                    inner join tb_material mat on mat.id = movl.idMaterial and imov.idMaterial = mat.id
                                                where movl.idMaterial = ?
                                                ${where} `, idMaterial);   
    
    return medicamento;
}

MaterialDAO.prototype.carregaMedicamentoAjusteEstoque = async function(idTipoMovimento, addFilter, unidade){
    let where = "";
    let orderBy = " ";

    if(addFilter != null){   
        if (addFilter.idEstabelecimento && addFilter.idEstabelecimento != "undefined" && addFilter.idEstabelecimento != "null") {
            where+=" AND und.id  = " + addFilter.idEstabelecimento + "";
        }
        
        if (addFilter.dataInicial && addFilter.dataFinal) {           
            where+=" AND  ml.dataMovimentacao >= '" + addFilter.dataInicial + " 00:00:00' AND  ml.dataMovimentacao <= '" + addFilter.dataFinal + " 23:59:59'";
        }

        if (addFilter.idMaterial && addFilter.idMaterial != "undefined") {
            where+=" AND mat.id = " + addFilter.idMaterial + "";
        }  

        if(addFilter.ordenadoPor){
            orderBy += " order by " + addFilter.ordenadoPor + " asc";
        }
    }
    let medicamento;

    if(unidade){
        medicamento =  await this._connection.query(`select und.id as idUnidade,
                                                            und.nomeFantasia as unidadeNome                                                            
                                                        from tb_movimento_livro ml
                                                        inner join tb_movimento_geral mg on mg.id = ml.idMovimentoGeral 
                                                        inner join tb_usuario us on mg.idUsuario = us.id
                                                        inner join tb_material mat on ml.idMaterial = mat.id
                                                        inner join tb_tipo_movimento tmv on ml.idTipoMovimento = tmv.id
                                                        inner join tb_estabelecimento und on ml.idEstabelecimento = und.id
                                                        where mat.situacao = 1
                                                        and mat.dispensavel = 1               
                                                        and und.situacao = 1
                                                        and ml.idTipoMovimento = ?
                                                        ${where}                                                                                                                 
                                                        group by und.id`, [idTipoMovimento]);
    }else{
        medicamento =  await this._connection.query(`select distinct
                                                    und.nomeFantasia as unidade,
                                                    mat.codigo as codigoMaterial,
                                                    mat.descricao as nomeMaterial,
                                                    case when tmv.operacao = 1 then  ml.quantidadeEntrada
		                                                 when tmv.operacao = 2 then  ml.quantidadeSaida
		                                                 when tmv.operacao = 3 then  ml.quantidadePerda end as quantidade,
                                                    ml.dataMovimentacao as dataMovimentacao,
                                                    mg.id as documento,
                                                    us.nome as nomeUsuario,
                                                    IFNULL(mg.motivo,'') as motivo
                                                from tb_movimento_livro ml
                                                inner join tb_movimento_geral mg on mg.id = ml.idMovimentoGeral 
                                                inner join tb_usuario us on mg.idUsuario = us.id
                                                inner join tb_material mat on ml.idMaterial = mat.id
                                                inner join tb_tipo_movimento tmv on ml.idTipoMovimento = tmv.id
                                                inner join tb_estabelecimento und on ml.idEstabelecimento = und.id
                                                where mat.situacao = 1
                                                and mat.dispensavel = 1               
                                                and und.situacao = 1
                                                and ml.idTipoMovimento = ?
                                                ${where} 
                                                ${orderBy} `, idTipoMovimento);  
    }
    return medicamento;
}

module.exports = function(){
    return MaterialDAO;
};

