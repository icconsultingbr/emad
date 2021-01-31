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
    let result =  await this._connection.query(`SELECT a.*, 
                                                CONCAT(h.cid_10, ' - ', h.nome) as nomeHipoteseDiagnostica FROM ${this._table} a 
                                                INNER JOIN tb_hipotese_diagnostica h on h.id = a.idHipoteseDiagnostica where a.id=?`, [id]);
    return result ? result[0] : null;
}

TipoExameDAO.prototype.carregaHipotese = async function(id){
    let result =  await this._connection.query(`SELECT a.idHipoteseDiagnostica FROM ${this._table} a where a.id=?`, [id]);
    return result ? result[0] : null;
}

TipoExameDAO.prototype.listaAsync = async function(addFilter) {     
    let orderBy = addFilter.sortColumn ? `${addFilter.sortColumn}` : "id";

    const join = ` FROM ${this._table} a INNER JOIN tb_hipotese_diagnostica h on h.id = a.idHipoteseDiagnostica`;

    const count = await this._connection.query(`SELECT COUNT(1) as total ${join}`);

    const query = QueryBuilder.datatable(`SELECT a.*, CONCAT(h.cid_10, ' - ', h.nome) as nomeHipoteseDiagnostica ${join}`, orderBy, addFilter.sortOrder, addFilter.limit, addFilter.offset);

    const result = await this._connection.query(query);

    return {
        total: count[0].total,
        items: result
    }
}

module.exports = function(){
    return TipoExameDAO;
};

