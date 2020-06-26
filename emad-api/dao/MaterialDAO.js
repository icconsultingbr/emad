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
                            FROM ${this._table} a
                            INNER JOIN tb_unidade_material unidadeMaterial ON (a.idUnidadeMaterial = unidadeMaterial.id)
                            INNER JOIN tb_profissional profissional ON (profissional.situacao = 1 and profissional.id=${idProfissional})
                            LEFT JOIN tb_especialidade_material espec ON (a.id = espec.idMaterial and espec.situacao = 1 and espec.idEspecialidade = profissional.idEspecialidade)                            
                            WHERE a.situacao = 1 ${where} 
                            ORDER BY a.descricao asc`, callback);
}

module.exports = function(){
    return MaterialDAO;
};