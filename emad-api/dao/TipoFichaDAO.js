function TipoFichaDAO(connection) {
    this._connection = connection;
    this._table = "tb_tipo_ficha";
}

TipoFichaDAO.prototype.salva = function (obj, callback) {
    this._connection.query(`INSERT INTO ${this._table} SET ?`, obj, callback);
}

TipoFichaDAO.prototype.atualiza = function (obj, id, callback) {
    this._connection.query(`UPDATE ${this._table} SET ? WHERE id= ?`, [obj, id], callback);
}

TipoFichaDAO.prototype.lista = function (callback) {
    this._connection.query(`SELECT id, nome, situacao, tipo FROM ${this._table}  WHERE situacao = 1`, callback);
}

TipoFichaDAO.prototype.buscaPorId = function (id, callback) {
    this._connection.query(`SELECT * FROM ${this._table} WHERE id = ?`, id, callback);
}

TipoFichaDAO.prototype.buscaConfigPorId = function (id, callback) {
    this._connection.query(`SELECT * FROM ${this._table} WHERE tipoAtendimentoSus = ?`, id, callback);
}

TipoFichaDAO.prototype.buscaTemplatePorId = function (id, callback) {
    this._connection.query(`SELECT xmlTemplate, queryTemplate  FROM ${this._table} WHERE id = ?`, id, callback);
}

TipoFichaDAO.prototype.buscaTemplatePorIdSync = async function (id) {
    const template = await this._connection.query(`SELECT xmlTemplate, queryTemplate  FROM ${this._table} WHERE id = ?`, id);
    return template;
}

TipoFichaDAO.prototype.buscaDominio = function (callback) {
    this._connection.query(`SELECT id, nome FROM ${this._table}`, callback);
}

TipoFichaDAO.prototype.dominio = async function (callback) {
    this._connection.query("select id, nome FROM " + this._table + " WHERE situacao = 1 ORDER BY id ASC", callback);
}

TipoFichaDAO.prototype.buscarPorIdEstabelecimento = async function (idEstabelecimento) {
    let result = await this._connection.query(`SELECT ttf.id, ttf.nome FROM 
                                                   tb_estabelecimento_ficha tef 
                                               INNER JOIN 
                                                   tb_tipo_ficha ttf ON ttf.id = tef.idTipoFicha  
                                               WHERE 
                                                   ttf.situacao = 1
                                                   tef.idEstabelecimento =?`, [idEstabelecimento] + " ORDER BY ttf.id ASC");

    return result ? result[0] : null;

}

TipoFichaDAO.prototype.salvaTipoFichaEstabelecimento = function (tipoFicha, callback) {
    tipoFicha.forEach(ficha => {
        this._connection.query(`INSERT INTO tb_estabelecimento_ficha SET ?`, ficha, callback);
    });
}

TipoFichaDAO.prototype.deletaPorIdEstabelecimento = function (id, callback) {
    this._connection.query("DELETE FROM tb_estabelecimento_ficha WHERE idEstabelecimento = ? ", id, callback);
}

TipoFichaDAO.prototype.deletaPorId = function (id, callback) {
    this._connection.query("UPDATE " + this._table + " set situacao = 0 WHERE id = ? ", id, callback);
}

module.exports = function () {
    return TipoFichaDAO;
};