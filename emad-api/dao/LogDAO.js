function LogDAO(connection) {
    this._connection = connection;
    this._table = "tb_log";
}


LogDAO.prototype.lista = function(addFilter, usuario,  callback) {


    let where = " 1=1 ";

    if (addFilter != null) {       
       
        if(addFilter.idEstabelecimento) {
            where += ` AND l.idEstabelecimento = ${addFilter.idEstabelecimento}`;
        }
    }

    where += ` AND (l.idUsuario = u.id OR l.idUsuario IS NULL)`;


    this._connection.query(`select 
    l.id,
    l.dataCriacao, 
    u.nome as idUsuario,
    l.entrada , 
    l.funcionalidade, 
    l.acao, 
    e.nomeFantasia as idEstabelecimento 
    
    FROM ${this._table} as l 
    LEFT JOIN tb_usuario u ON(l.idUsuario = u.id) 
    LEFT JOIN tb_estabelecimento e ON(l.idEstabelecimento = e.id)
    WHERE ${where} AND funcionalidade NOT LIKE '%/dominios/%' AND funcionalidade NOT LIKE '%/menu%' 
    ORDER BY l.id DESC`,callback);
}

LogDAO.prototype.salva = function(obj,callback) {
    console.log(obj);
    this._connection.query("INSERT INTO "+this._table+" SET ?", obj, callback);
}



module.exports = function(){
    return LogDAO;
};