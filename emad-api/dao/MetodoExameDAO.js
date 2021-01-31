const QueryBuilder = require('../infrastructure/QueryBuilder');

function MetodoExameDAO(connection) {
    this._connection = connection;    
    this._table = "tb_metodo_exame";    
}

MetodoExameDAO.prototype.salvaSync = async function(objeto) {
    const response = await this._connection.query("INSERT INTO "+this._table+" SET ?", objeto);
    return [response];
}

MetodoExameDAO.prototype.atualizaSync = async function(objeto) {
    let response =  await this._connection.query("UPDATE "+this._table+" SET ?  where id= ?", [objeto, objeto.id]);
    return response;
}

MetodoExameDAO.prototype.buscaPorIdSync = async function(id){
    let result =  await this._connection.query(`SELECT * FROM ${this._table} where id=?`, [id]);
    return result ? result[0] : null;
}

MetodoExameDAO.prototype.listaAsync = async function(addFilter) {     
    let orderBy = addFilter.sortColumn ? `${addFilter.sortColumn}` : "id";

    const join = ` FROM ${this._table} a`;

    const count = await this._connection.query(`SELECT COUNT(1) as total ${join}`);

    const query = QueryBuilder.datatable(`SELECT * ${join}`, orderBy, addFilter.sortOrder, addFilter.limit, addFilter.offset);

    const result = await this._connection.query(query);

    return {
        total: count[0].total,
        items: result
    }
}

module.exports = function(){
    return MetodoExameDAO;
};

