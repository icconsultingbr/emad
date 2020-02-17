function EstabelecimentoProfissionalDAO(connection) {
    this._connection = connection;
    this._table = "tb_estabelecimento_profissional";
}

EstabelecimentoProfissionalDAO.prototype.deletaEstabelecimentosPorProfissional = function (id, callback) {

    this._connection.query("DELETE FROM " + this._table + " WHERE idProfissional = ?", id, callback);
}

EstabelecimentoProfissionalDAO.prototype.atualizaEstabelecimentosPorProfissional = function (estabelecimentos, callback) {

    this._connection.query("INSERT INTO " + this._table + " (idProfissional, idEstabelecimento) VALUES " + estabelecimentos, callback);
}

EstabelecimentoProfissionalDAO.prototype.buscaPorUsuario = function (id, callback) {

    this._connection.query(`
        SELECT e.id, e.razaoSocial as nome FROM ${this._table} as ep 
        INNER JOIN tb_estabelecimento e ON(ep.idEstabelecimento = e.id) 
        WHERE ep.idProfissional = ? AND e.situacao = 1`, id, callback);
}


module.exports = function () {
    return EstabelecimentoProfissionalDAO;
};