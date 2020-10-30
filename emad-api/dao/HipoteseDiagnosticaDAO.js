function HipoteseDiagnosticaDAO(connection) {
    this._connection = connection;
    this._table = "tb_hipotese_diagnostica";
}


HipoteseDiagnosticaDAO.prototype.lista = function(callback) {
    this._connection.query("select * FROM "+this._table+" WHERE situacao = 1 ORDER BY nome ASC",callback);
}

HipoteseDiagnosticaDAO.prototype.listarAsync = async function (addFilter) {
    let where = "";
    let offset = " LIMIT 10 OFFSET 0 ";
    

    if(addFilter){

        if(addFilter.nome && addFilter.nome != 'null' && addFilter.nome != 'undefined'){
            where += ` AND UPPER(nome) LIKE '%${addFilter.nome.toUpperCase()}%'`;
        }

        if(addFilter.cid && addFilter.cid != 'null' && addFilter.cid != 'undefined'){
            where += ` AND UPPER(cid_10) LIKE '%${addFilter.cid.toUpperCase()}%'`;
        }

        if(addFilter.limit && addFilter.offset){
            offset = `LIMIT ${addFilter.limit} OFFSET ${addFilter.limit * addFilter.offset}`;
        }
    }    
    
    const join = ` FROM ${this._table}
    WHERE situacao = 1 ${where}`;

    const count = await this._connection.query(`SELECT COUNT(1) as total ${join}`);

    const result = await this._connection.query(`SELECT * ${join}  
                                            ORDER BY nome ASC ${offset}`);
    return {
        total: count[0].total,
        items: result
    }
}


HipoteseDiagnosticaDAO.prototype.dominio = function(callback) {
    this._connection.query("select id, CONCAT(nome, ' (',cid_10,')') as nome FROM "+this._table+" WHERE situacao = 1 ORDER BY nome ASC",callback);
}

HipoteseDiagnosticaDAO.prototype.buscaPorId = function (id,callback) {
    this._connection.query("select * from "+this._table+" where id = ?",id,callback); 
}

HipoteseDiagnosticaDAO.prototype.salva = function(objeto,callback) {
    this._connection.query("INSERT INTO "+this._table+" SET ?", objeto, callback);
}

HipoteseDiagnosticaDAO.prototype.atualiza = function(objeto,id, callback) {
    this._connection.query("UPDATE "+this._table+" SET ?  where id= ?", [objeto, id], callback);
}

HipoteseDiagnosticaDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}


module.exports = function(){
    return HipoteseDiagnosticaDAO;
};