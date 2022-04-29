function AtendimentoTipoFornecimentoOdontoDAO(connection) {
    this._connection = connection;
    this._table = "tb_tipo_fornecimento_odonto_atendimento";
}
AtendimentoTipoFornecimentoOdontoDAO.prototype.buscaPorAtendimentoId = function (idAtendimento, callback) {
    this._connection.query(`SELECT 
      tpforn.id,
      tpforn.nome
    from ${this._table} atvcol   
    INNER JOIN tb_tipo_fornecimento_odonto tpforn ON (tpforn.id = atvcol.idFornecimento) 
    WHERE atvcol.idAtendimento = ?` , idAtendimento, callback);
}

AtendimentoTipoFornecimentoOdontoDAO.prototype.deletaPorId = function (id, callback) {
    this._connection.query(`DELETE FROM ${this._table} WHERE id=?`, id, callback);
}

AtendimentoTipoFornecimentoOdontoDAO.prototype.salvaSync = async function (objeto) {
    const response = await this._connection.query("INSERT INTO " + this._table + " SET ?", objeto);
    return [response];
}

AtendimentoTipoFornecimentoOdontoDAO.prototype.atualizaPorId = async function (objeto, id, callback) {
    this._connection.query("UPDATE " + this._table + " SET ?  where id= ?", [objeto, id], callback);
}

module.exports = function () {
    return AtendimentoTipoFornecimentoOdontoDAO;
};