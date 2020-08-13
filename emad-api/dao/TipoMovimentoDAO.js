function TipoMovimentoDAO(connection) {
    this._connection = connection;    
    this._table = "tb_tipo_movimento";    
}

TipoMovimentoDAO.prototype.carregaNomeTipoMovimento = async function(id){
    let result =  await this._connection.query(`SELECT nome FROM ${this._table} where id=?`, [id]);
    return result[0].nome ? result[0].nome : "";
}

TipoMovimentoDAO.prototype.carregaListaMovimentoAdministrativo = async function(){
    let result =  await this._connection.query(`SELECT * FROM ${this._table} where movimentoAdministrativo=1 order by nome asc`);
    return result;
}

TipoMovimentoDAO.prototype.carregaPorId = async function(id){
    let result =  await this._connection.query(`SELECT * FROM ${this._table} where id=?`, [id]);
    return result ? result[0] : null;
}

TipoMovimentoDAO.prototype.carregaListaPorOperacao = async function(idOperacao){
    let result =  await this._connection.query(`SELECT * FROM ${this._table} where operacao=? order by nome asc`, idOperacao);
    return result;
}

module.exports = function(){
    return TipoMovimentoDAO;
};