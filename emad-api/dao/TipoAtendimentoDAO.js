function TipoAtendimentoDAO(connection) {
    this._connection = connection;
    this._table = "tb_tipo_atendimento";
}

TipoAtendimentoDAO.prototype.buscarPorIdTipoFicha = function (id, callback) {

    this._connection.query(`select tta.id, tta.nome from tb_tipo_atendimento_tipo_ficha ttatf 
        inner join tb_tipo_atendimento tta on tta.id = ttatf.idTipoAtendimento
        inner join tb_tipo_ficha ttf  on ttf.id = ttatf.idTipoFicha
        where ttf.id=?  ORDER BY tta.id ASC`, id, callback);
}

module.exports = function () {
    return TipoAtendimentoDAO;
};