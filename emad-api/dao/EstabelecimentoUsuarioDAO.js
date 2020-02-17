function EstabelecimentoUsuarioDAO(connection) {
    this._connection = connection;
    this._table = "tb_estabelecimento_usuario";
}

EstabelecimentoUsuarioDAO.prototype.deletaEstabelecimentosPorUsuario = function (id, callback) {
    console.log('id', id);
    this._connection.query("DELETE FROM " + this._table + " WHERE idUsuario = ?", id, callback);
}

EstabelecimentoUsuarioDAO.prototype.atualizaEstabelecimentosPorUsuario = function (estabelecimentos, callback) {

    this._connection.query(`INSERT INTO ${this._table} (idUsuario, idEstabelecimento) VALUES ${estabelecimentos}`, callback);
}

EstabelecimentoUsuarioDAO.prototype.buscaPorUsuario = function (id, callback) {

    this._connection.query(`
        SELECT e.id, e.razaoSocial as nome FROM ${this._table} as ep 
        INNER JOIN tb_estabelecimento e ON(ep.idEstabelecimento = e.id) 
        WHERE ep.idUsuario = ? AND e.situacao = 1`, id, callback);
}


module.exports = function () {
    return EstabelecimentoUsuarioDAO;
};