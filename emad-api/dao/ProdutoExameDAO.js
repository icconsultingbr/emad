const QueryBuilder = require('../infrastructure/QueryBuilder');

function ProdutoExameDAO(connection) {
    this._connection = connection;    
    this._table = "tb_produto_exame";    
}

ProdutoExameDAO.prototype.salvaSync = async function(objeto) {
    const response = await this._connection.query("INSERT INTO "+this._table+" SET ?", objeto);
    return [response];
}

ProdutoExameDAO.prototype.atualizaSync = async function(objeto) {
    let response =  await this._connection.query("UPDATE "+this._table+" SET ?  where id= ?", [objeto, objeto.id]);
    return response;
}

ProdutoExameDAO.prototype.buscaPorIdSync = async function(id){
    let result =  await this._connection.query(`SELECT * FROM ${this._table} where id=?`, [id]);
    return result ? result[0] : null;
}

ProdutoExameDAO.prototype.listaAsync = async function(addFilter) {     
    let orderBy = addFilter.sortColumn ? `${addFilter.sortColumn}` : "id";
    let where = "";

    if(addFilter != null){       
        if(addFilter.idTipoExame)
            where +=" AND a.idTipoExame = '" + addFilter.idTipoExame + "'";
    }

    const join = `  FROM ${this._table} a
        INNER JOIN tb_tipo_exame tipoExame on tipoExame.id = a.idTipoExame
        WHERE 1 == 1 ${where}`;

    const count = await this._connection.query(`SELECT COUNT(1) as total ${join}`);

    const query = QueryBuilder.datatable(`SELECT  a.*, 
                                           tipoExame.nome nomeTipoExame 
                                           ${join}`, orderBy, addFilter.sortOrder, addFilter.limit, addFilter.offset);

    const result = await this._connection.query(query);

    return {
        total: count[0].total,
        items: result
    }
}

ProdutoExameDAO.prototype.listaDominio = async function(idTipoExame){
    let result =  await this._connection.query(`SELECT id, nome FROM ${this._table} where idTipoExame=?`, [idTipoExame]);
    return result;
}

module.exports = function(){
    return ProdutoExameDAO;
};

