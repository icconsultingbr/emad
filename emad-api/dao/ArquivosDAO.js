function ArquivosDAO(connection) {
    this._connection = connection;
    this._table = "tb_exame_arquivo";
}

ArquivosDAO.prototype.buscaPorId = async function (id) {
    let result = [];
    result = await this._connection.query(`SELECT * FROM ${this._table} a where a.situacao = 1 AND a.idExame=?`, [id]);
    return result;
}

ArquivosDAO.prototype.salva = async function (obj, callback) {
   return this._connection.query(`INSERT INTO ${this._table} SET ?`, obj, callback);
}

ArquivosDAO.prototype.atualiza = async function (obj) {
    let atendimento = await this._connection.query(`UPDATE ${this._table} set situacao=?, idUsuarioAlteracao=?, dataAlteracao=? where id=?`
        , [0, obj.idUsuarioAlteracao, obj.dataAlteracao, obj.idExame]);
    return atendimento;

}



module.exports = function () {
    return ArquivosDAO;
};