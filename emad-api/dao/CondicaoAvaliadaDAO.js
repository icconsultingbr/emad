const QueryBuilder = require('../infrastructure/QueryBuilder');

function CondicaoAvaliadaDAO(connection) {
    this._connection = connection;
    this._table = "tb_condicao_avaliada_ciap2";
}

CondicaoAvaliadaDAO.prototype.lista = async function (queryFilter) {
    let orderBy = queryFilter.sortColumn ? `${queryFilter.sortColumn}` : "a.id";
    let where = "";
    let join = "";

    if (queryFilter.codigoAB || queryFilter.descricaoAB) {

        where += "WHERE 1 = 1"

        if (queryFilter.codigoAB && queryFilter.codigoAB != 'null' && queryFilter.codigoAB != 'undefined') {
            where += ` AND UPPER(codigoAB) LIKE '%${queryFilter.codigoAB.toUpperCase()}%'`;
        }

        if (queryFilter.descricaoAB && queryFilter.descricaoAB != 'null' && queryFilter.descricaoAB != 'undefined') {
            where += ` AND UPPER(descricaoAB) LIKE '%${queryFilter.descricaoAB.toUpperCase()}%'`;
        }
    }

    const count = await this._connection.query(`SELECT COUNT(1) as total FROM ${this._table} a ${join} ${where}`);

    const query = QueryBuilder.datatable(`SELECT a.* FROM ${this._table} a ${join} ${where}`, orderBy, queryFilter.sortOrder, queryFilter.limit, queryFilter.offset);

    let result = await this._connection.query(query);

    return {
        total: count[0].total,
        items: result
    }
}

CondicaoAvaliadaDAO.prototype.buscaPorId = async function (id) {
    let result = await this._connection.query(`SELECT * FROM ${this._table} WHERE id = ?`, id);
    return result ? result[0] : null;
}

CondicaoAvaliadaDAO.prototype.deletaPorId = async function (id) {
    return await this._connection.query("Delete " + this._table + "WHERE id = ? ", id);
}

module.exports = function () {
    return CondicaoAvaliadaDAO;
};