function EstabelecimentoUsuarioDAO(connection) {
    this._connection = connection;
    this._table = "tb_estabelecimento_usuario";
}

EstabelecimentoUsuarioDAO.prototype.deletaEstabelecimentosPorUsuario = function (id, callback) {
    console.log('id', id);
    this._connection.query("DELETE FROM " + this._table + " WHERE idUsuario = ?", id, callback);
}

EstabelecimentoUsuarioDAO.prototype.deletaEstabelecimentosPorUsuarioSync = async function (id) {
    console.log('id', id);
    let result = await this._connection.query("DELETE FROM " + this._table + " WHERE idUsuario = ?", id);
    return result;
}

EstabelecimentoUsuarioDAO.prototype.atualizaEstabelecimentosPorUsuario = function (estabelecimentos, callback) {
    this._connection.query(`INSERT INTO ${this._table} (idUsuario, idEstabelecimento) VALUES ${estabelecimentos}`, callback);
}

EstabelecimentoUsuarioDAO.prototype.atualizaEstabelecimentosPorUsuarioSync = async function (estabelecimentos) {
    let result = await this._connection.query(`INSERT INTO ${this._table} (idUsuario, idEstabelecimento) VALUES ${estabelecimentos}`);
    return result;
}

EstabelecimentoUsuarioDAO.prototype.buscaPorUsuario = async function (id) {
    return await this._connection.query(`
        SELECT e.id, e.nomeFantasia as nome, e.nomeFantasia FROM ${this._table} as ep 
        INNER JOIN tb_estabelecimento e ON(ep.idEstabelecimento = e.id) 
        WHERE ep.idUsuario = ? AND e.situacao = 1`, id);
}

EstabelecimentoUsuarioDAO.prototype.buscaPorUsuarioSync = async function (id) {
    let result = await this._connection.query(`
        SELECT e.id, e.nomeFantasia as nome, e.nomeFantasia FROM ${this._table} as ep 
        INNER JOIN tb_estabelecimento e ON(ep.idEstabelecimento = e.id) 
        WHERE ep.idUsuario = ? AND e.situacao = 1`, id);
    return result;
}

module.exports = function () {
    return EstabelecimentoUsuarioDAO;
};