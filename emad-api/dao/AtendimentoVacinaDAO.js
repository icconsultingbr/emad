function AtendimentoVacinaDAO(connection) {
    this._connection = connection;
    this._table = "tb_atendimento_vacina";
}

AtendimentoVacinaDAO.prototype.salva = async function (objeto) {
    const response = await this._connection.query("INSERT INTO " + this._table + " SET ?", objeto);
    return [response];
}

AtendimentoVacinaDAO.prototype.buscarPorAtendimentoId = async function (idAtendimento) {
    let atendimento = await this._connection.query(`select phd.id, phd.nome, phd.validade, phd.lote, phd.nomeProfissional, phd.dose from ${this._table} phd 
    WHERE phd.situacao = 1 AND phd.idAtendimento = ?` , idAtendimento);
    return atendimento;
}

AtendimentoVacinaDAO.prototype.deletaPorId = async function (obj) {
    let atendimento = await this._connection.query(`UPDATE ${this._table} set situacao=?, idUsuarioAlteracao=?, dataAlteracao=? where id=?`
        , [obj.situacao, obj.idUsuarioAlteracao, obj.dataAlteracao, obj.id]);
    return atendimento;
}

module.exports = function () {
    return AtendimentoVacinaDAO;
};