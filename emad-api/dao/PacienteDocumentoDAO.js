function PacienteDocumentoDAO(connection) {
    this._connection = connection;
    this._table = "tb_paciente_documento";
}

PacienteDocumentoDAO.prototype.buscaPorId = async function (id) {
    let result = [];
    result = await this._connection.query(`SELECT * FROM ${this._table} a where a.situacao = 1 AND a.idUsuarioCriacao=?`, [id]);
    return result;
}

PacienteDocumentoDAO.prototype.salva = async function (obj, callback) {
   return this._connection.query(`INSERT INTO ${this._table} SET ?`, obj, callback);
}

PacienteDocumentoDAO.prototype.atualiza = async function (obj) {
    let paciente = await this._connection.query(`UPDATE ${this._table} set situacao=?, idUsuarioAlteracao=?, dataAlteracao=? where id=?`
        , [0, obj.idUsuarioAlteracao, obj.dataAlteracao, obj.idDocumento]);
    return paciente;
}

module.exports = function () {
    return PacienteDocumentoDAO;
};