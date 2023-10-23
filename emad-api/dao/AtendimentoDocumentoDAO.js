function AtendimentoDocumentoDAO(connection) {
    this._connection = connection;
    this._table = "tb_atendimento_documento";
}

AtendimentoDocumentoDAO.prototype.buscaPorIdAtendimento = async function (idAtendimento) {
    let result = [];
    result = await this._connection.query(`SELECT * FROM ${this._table} a where a.situacao = 1 AND a.idAtendimento=?`, [idAtendimento]);
    return result;
}

AtendimentoDocumentoDAO.prototype.salva = async function (obj, callback) {
   return this._connection.query(`INSERT INTO ${this._table} SET ?`, obj, callback);
}

AtendimentoDocumentoDAO.prototype.atualiza = async function (obj) {
    let atendimento = await this._connection.query(`UPDATE ${this._table} set situacao=?, idUsuarioAlteracao=?, dataAlteracao=? where id=?`
        , [0, obj.idUsuarioAlteracao, obj.dataAlteracao, obj.idDocumento]);
    return atendimento;

}

module.exports = function () {
    return AtendimentoDocumentoDAO;
};