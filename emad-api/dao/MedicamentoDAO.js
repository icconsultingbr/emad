function MedicamentoDAO(connection) {
    this._connection = connection;
    this._table = "material";
}

MedicamentoDAO.prototype.listaMedicamentosDim = function(descricao, callback) {
    
    let where = "";

    if (descricao) {
        where+=" AND m.descricao like '%"+descricao + "%'";
    }
    
    this._connection.query(`select
    m.id_material, 
    m.codigo_material, 
    m.descricao, 
    u.unidade
    from
        material m, unidade_material u
    where
    m.flg_dispensavel = 'S'
    and m.status_2='A'
    ${where}
    and m.unidade_material_id_unidade_material=u.id_unidade_material
    order by
    m.descricao`,callback);    
}

MedicamentoDAO.prototype.dominio = function(callback) {
    // let where = "";

    // if (addFilter.descricao) {
    //     where+=" AND m.descricao like '%"+addFilter.descricao + "%'";
    // }
    
    this._connection.query(`select
    m.id_material as id, 
    m.codigo_material, 
    m.descricao as nome, 
    u.unidade
    from
        material m, unidade_material u
    where
    m.flg_dispensavel = 'S'
    and m.status_2='A'
    and m.unidade_material_id_unidade_material=u.id_unidade_material
    order by
    m.descricao`,callback); 
}

MedicamentoDAO.prototype.buscaPorId = function (id,callback) {
    this._connection.query("select * from "+this._table+" where id = ?",id,callback); 
}

MedicamentoDAO.prototype.salva = function(objeto,callback) {
    this._connection.query("INSERT INTO "+this._table+" SET ?", objeto, callback);
}

MedicamentoDAO.prototype.atualiza = function(objeto,id, callback) {
    this._connection.query("UPDATE "+this._table+" SET ?  where id= ?", [objeto, id], callback);
}

MedicamentoDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}


module.exports = function(){
    return MedicamentoDAO;
};