function AtendimentoProfissionalAtividadeColetivaDAO(connection) {
    this._connection = connection;
    this._table = "tb_atividade_coletiva_profissionais";
}
AtendimentoProfissionalAtividadeColetivaDAO.prototype.buscaPorAtendimentoId = function (idAtendimento, callback) {
    this._connection.query(`SELECT 
        tacp.id,
        tp.nome,
        tp.profissionalCNS,
        tp.cargoProfissional
    FROM ${this._table} tacp   
    INNER JOIN tb_profissional tp ON (tacp.idProfissional =  tp.id ) 
    WHERE tacp.idAtendimento = ?` , idAtendimento, callback);
}

AtendimentoProfissionalAtividadeColetivaDAO.prototype.deletaPorId = function (id, callback) {
    this._connection.query(`DELETE FROM ${this._table} WHERE id=?`, id, callback);
}

AtendimentoProfissionalAtividadeColetivaDAO.prototype.salvaSync = async function (objeto) {
    const response = await this._connection.query("INSERT INTO " + this._table + " SET ?", objeto);
    return [response];
}

AtendimentoProfissionalAtividadeColetivaDAO.prototype.atualizaPorId = async function (objeto, id) {
    let profissional = await this._connection.query("UPDATE " + this._table + " SET ?  where id= ?", [objeto, id]);

    return profissional[0];
}

module.exports = function () {
    return AtendimentoProfissionalAtividadeColetivaDAO;
};