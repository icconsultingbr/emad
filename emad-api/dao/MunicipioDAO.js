function MunicipioDAO(connection,connectionDim) {
    this._connection = connection;
    this._connectionDim = connectionDim;
    this._table = "tb_municipio";
}


MunicipioDAO.prototype.lista = function(callback) {
    this._connection.query("select * FROM "+this._table+" ORDER BY nome ASC",callback);
}

MunicipioDAO.prototype.buscaPorId = function (id,callback) {
    this._connection.query("select * from "+this._table+" where id = ?",id,callback);
}

MunicipioDAO.prototype.buscaPorUfId = function (id,callback) {
    this._connection.query(
        "SELECT m.* from "+this._table+" as m "+
    "INNER JOIN tb_uf as u ON(u.uf = m.uf) WHERE u.id = ? ORDER BY m.nome ASC",id,callback);
}

MunicipioDAO.prototype.buscarPorMunicipio = function (municipio,callback) {
    this._connection.query("select id from "+this._table+" where nome = ?",municipio,callback);
}

MunicipioDAO.prototype.buscaPorUfNomeDim = function (nome_cidade, uf,callback) {
    this._connectionDim.query(
    `select cid.id_cidade 
    from cidade cid inner join estado est on est.id_estado = cid.estado_id_estado 
    where cid.nome=? and est.uf=? LIMIT 1`,[nome_cidade,uf],callback);
}

module.exports = function(){
    return MunicipioDAO;
};