function AgendaDAO(connection) {
    this._connection = connection;
    this._table = "tb_agenda_profissional";
}

AgendaDAO.prototype.salva = function(obj, callback) {
    this._connection.query(`INSERT INTO ${this._table} SET ?`, obj, callback);
}

AgendaDAO.prototype.atualiza = function(obj, id, callback) {
    this._connection.query(`UPDATE ${this._table} SET ? WHERE id= ?`, [obj, id], callback);
}

AgendaDAO.prototype.lista = function(addFilter, callback) {

    let where = " 1=1";

    if(addFilter.idPaciente != 'null'){
        where += " AND a.idPaciente = " +addFilter.idPaciente;
    }

    if(addFilter.idEquipe != 'null'){
        where += " AND a.idEquipe = " +addFilter.idEquipe;
    }

    if(addFilter.idProfissional != 'null'){
        where += " AND a.idProfissional = " +addFilter.idProfissional;
    }


   


    this._connection.query(
        `SELECT 

        a.id, 
        p.nome, 
        a.idEquipe, 
        a.idProfissional, 
        a.idTipoAgenda, 
        a.dataInicio, 
        a.dataFim, 
        a.dataVigencia, 
        a.daysFlag, 
        a.observacoes, 
        a.idPaciente, 
        a.situacao, 
        a.idEstabelecimento 
        
        FROM ${this._table} a 
        INNER JOIN tb_profissional p ON(a.idProfissional = p.id) 
        WHERE ${where} AND a.situacao = 1`, callback);
}

AgendaDAO.prototype.buscaPorId = function (id,callback) {
    this._connection.query(`select 
    a.id, 
    p.nome, 
    e.nome as equipeNome, 
    a.idEquipe, 
    a.idProfissional, 
    a.idTipoAgenda, 
    a.dataInicio, 
    a.dataFim, 
    a.dataVigencia, 
    a.daysFlag, 
    a.observacoes, 
    a.idPaciente, 
    a.situacao 
    
    from ${this._table} a 
    inner join tb_profissional p ON(a.idProfissional = p.id) 
    inner join tb_equipe e ON(a.idEquipe = e.id)
    where a.id = ?`,id,callback);
}


AgendaDAO.prototype.deletaPorId = function (id, callback){
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}



module.exports = function(){
    return AgendaDAO;
};