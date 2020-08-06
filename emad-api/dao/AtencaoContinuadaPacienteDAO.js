function AtencaoContinuadaPacienteDAO(connection) {
    this._connection = connection;
    this._table = "tb_atencao_continuada_paciente";
}


AtencaoContinuadaPacienteDAO.prototype.deletaGrupoPorPacienteSync = async function (id) {
    console.log('id', id);
    let result = await this._connection.query("DELETE FROM " + this._table + " WHERE idPaciente = ?", id);
    return result;
}

AtencaoContinuadaPacienteDAO.prototype.atualizaGrupoPorPacienteSync = async function (grupos) {
    let result = await this._connection.query(`INSERT INTO ${this._table} (idPaciente, idAtencaoContinuada) VALUES ${grupos}`);
    return result;
}

AtencaoContinuadaPacienteDAO.prototype.buscaPorPacienteSync = async function (id) {
    let result = await this._connection.query(`
        SELECT ac.id, ac.nome FROM ${this._table} as acp 
        INNER JOIN tb_atencao_continuada ac ON(acp.idAtencaoContinuada = ac.id)         
        WHERE acp.idPaciente = ?`, id);
    return result;
}

module.exports = function () {
    return AtencaoContinuadaPacienteDAO;
};