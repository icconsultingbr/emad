const QueryBuilder = require('../infrastructure/QueryBuilder');

function TipoExameDAO(connection) {
    this._connection = connection;    
    this._table = "tb_tipo_exame";    
}

TipoExameDAO.prototype.salvaSync = async function(objeto) {
    const response = await this._connection.query("INSERT INTO "+this._table+" SET ?", objeto);
    return [response];
}

TipoExameDAO.prototype.atualizaSync = async function(objeto) {
    let response =  await this._connection.query("UPDATE "+this._table+" SET ?  where id= ?", [objeto, objeto.id]);
    return response;
}

TipoExameDAO.prototype.buscaPorIdSync = async function(id){
    let result =  await this._connection.query(`SELECT * FROM ${this._table} where id=?`, [id]);
    return result ? result[0] : null;
}

TipoExameDAO.prototype.listaAsync = async function(addFilter) { 
    let where = "";
    let offset = "";
    let orderBy = addFilter.sortColumn ? `${addFilter.sortColumn}` : "id";

    const join = ` FROM ${this._table} a WHERE 1=1 ${where} `;

    const count = await this._connection.query(`SELECT COUNT(1) as total ${join}`);

    const query = QueryBuilder.datatable(`SELECT * ${join}`, orderBy, addFilter.sortOrder, addFilter.limit, addFilter.offset);

    const result = await this._connection.query(query);

    return {
        total: count[0].total,
        items: result
    }
}

module.exports = function(){
    return TipoExameDAO;
};

