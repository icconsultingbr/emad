function AtendimentoCondicaoAvaliadaDAO(connection) {
    this._connection = connection;
    this._table = "tb_atendimento_condicao_avaliada";
}

AtendimentoCondicaoAvaliadaDAO.prototype.deletaPorId = function (id, callback) {
    return this._connection.query(`DELETE FROM ${this._table} WHERE id=?`, id, callback);
}

AtendimentoCondicaoAvaliadaDAO.prototype.salva = async function (obj) {
    return await this._connection.query(`INSERT INTO ${this._table} (idAtendimento, idPaciente, idCondicaoAvaliada)
                                        VALUES (?, ?, ?)`, [obj.idAtendimento, obj.idPaciente, obj.idCondicaoAvaliada]);
}

AtendimentoCondicaoAvaliadaDAO.prototype.buscarPorAtendimentoId = async function (idAtendimento) {
    let atendimento = await this._connection.query(`select phd.id, hd.ciap2, hd.descricaoAB, hd.codigoAB, hd.sexo  from ${this._table} phd 
    INNER JOIN tb_condicao_avaliada hd ON(phd.idCondicaoAvaliada = hd.id)     
    WHERE phd.idAtendimento = ?` , idAtendimento);
    return atendimento;
}

module.exports = function () {
    return AtendimentoCondicaoAvaliadaDAO;
};