function AtendimentoDAO(connection) {
    this._connection = connection;
    this._table = "tb_atendimento";
}



AtendimentoDAO.prototype.lista = function(addFilter, callback) {   

    let where = "";

    if(addFilter != null){       

        if(addFilter.cartaoSus){
            where+=" AND p.cartaoSus LIKE '%"+addFilter.cartaoSus+"%'";
        }

        if(addFilter.cpf){
            where+=" AND p.cpf = '"+addFilter.cpf+"'";
        }

        if (addFilter.nomePaciente) {
            where+=" AND p.nome LIKE '%"+addFilter.nomePaciente+"%'";
        }

        if (addFilter.dataCriacao) {
           
            where+=" AND a.dataCriacao >= '"+addFilter.dataCriacao+" 00:00:00' AND a.dataCriacao <= '"+addFilter.dataCriacao+" 23:59:59'";
        }

        if (addFilter.idEstabelecimento) {
            where+=" AND a.idEstabelecimento  = "+addFilter.idEstabelecimento;
        }

        if (addFilter.situacao) {
            where+=" AND a.situacao  = '"+addFilter.situacao+"'";
        }

        if(addFilter.idSap){
            where+=" AND p.idSap like '%"+addFilter.idSap+"%'";
        }

        if(addFilter.situacaoAtendimento){

            if(addFilter.situacaoAtendimento == "F")
                where+=" AND a.dataFinalizacao IS NOT NULL";
            
            if(addFilter.situacaoAtendimento == "C")
                where+=" AND a.dataCancelamento IS NOT NULL";

            if(addFilter.situacaoAtendimento == "P")
                where+=" AND a.dataCancelamento IS NULL  AND a.dataFinalizacao IS NULL";
        }
    }

    this._connection.query(`SELECT 
        a.id, 
        a.idPaciente, 
        p.cartaoSus,
        p.cpf, 
        p.nome as nomePaciente, 
        a.dataCriacao,
        a.dataFinalizacao, 
        a.idEstabelecimento, 
        e.nomeFantasia, 
        a.idUsuario, 
        u.nome, 
        a.situacao,
    CASE
        WHEN a.dataFinalizacao IS NOT NULL THEN 'Finalizado'
        WHEN a.dataCancelamento IS NOT NULL THEN 'Cancelado'
        WHEN a.dataCancelamento IS NULL  AND a.dataFinalizacao IS NULL THEN 'Pendente'
    END AS situacaoAtendimento,
    p.idSap,
    a.tipoFicha
    FROM ${this._table} a 
    INNER JOIN tb_paciente p ON(a.idPaciente = p.id)  
    INNER JOIN tb_estabelecimento e ON(a.idEstabelecimento = e.id) 
    INNER JOIN tb_usuario u ON(a.idUsuario = u.id) 
    WHERE 1=1 ${where} 
    ORDER BY a.id DESC`, callback);
}


AtendimentoDAO.prototype.listaPorUsuario = function(id, addFilter, callback) {   
    let where = "";

    if(addFilter != null){       

        if(addFilter.cartaoSus){
            where+=" AND p.cartaoSus LIKE '%"+addFilter.cartaoSus+"%'";
        }

        if(addFilter.cpf){
            where+=" AND p.cpf = '"+addFilter.cpf+"'";
        }

        if (addFilter.nomePaciente) {
            where+=" AND p.nome LIKE '%"+addFilter.nomePaciente+"%'";
        }

        if (addFilter.dataCriacao) {
           
            where+=" AND a.dataCriacao >= '"+addFilter.dataCriacao+" 00:00:00' AND a.dataCriacao <= '"+addFilter.dataCriacao+" 23:59:59'";
        }

        if (addFilter.idEstabelecimento) {
            where+=" AND a.idEstabelecimento  = "+addFilter.idEstabelecimento;
        }

        if (addFilter.situacao) {
            where+=" AND a.situacao  = '"+addFilter.situacao+"'";
        }

        if(addFilter.idSap){
            where+=" AND p.idSap like '%"+addFilter.idSap+"%'";
        }

        if(addFilter.situacaoAtendimento){

            if(addFilter.situacaoAtendimento == "F")
                where+=" AND a.dataFinalizacao IS NOT NULL";
            
            if(addFilter.situacaoAtendimento == "C")
                where+=" AND a.dataCancelamento IS NOT NULL";

            if(addFilter.situacaoAtendimento == "P")
                where+=" AND a.dataCancelamento IS NULL  AND a.dataFinalizacao IS NULL";
        }
    }

    this._connection.query(`SELECT 
        a.id, 
        a.idPaciente, 
        p.cartaoSus,
        p.cpf, 
        p.nome as nomePaciente, 
        a.dataCriacao,
        a.dataFinalizacao, 
        a.idEstabelecimento, 
        e.nomeFantasia, 
        a.idUsuario, 
        u.nome, 
        a.situacao, 
        CASE
            WHEN a.dataFinalizacao IS NOT NULL THEN 'Finalizado'
            WHEN a.dataCancelamento IS NOT NULL THEN 'Cancelado'
            WHEN a.dataCancelamento IS NULL  AND a.dataFinalizacao IS NULL THEN 'Pendente'
        END AS situacaoAtendimento,
        p.idSap,
        a.tipoFicha     
    FROM ${this._table} a 
    INNER JOIN tb_paciente p ON(a.idPaciente = p.id)  
    INNER JOIN tb_estabelecimento e ON(a.idEstabelecimento = e.id) 
    INNER JOIN tb_usuario u ON(a.idUsuario = u.id) 
    WHERE a.idUsuario = ? ${where} 
    ORDER BY a.id DESC`, id, callback);
}


AtendimentoDAO.prototype.buscaPorId = function (id,callback) {
    this._connection.query("select p.nome, a.* from " +this._table + " a INNER JOIN tb_paciente p ON(a.idPaciente = p.id) WHERE a.id = ?" ,id,callback); 

}

AtendimentoDAO.prototype.buscaPorPacienteId = function (idPaciente, usuario, idEstabelecimento, callback) {
    //console.log("select * from "+this._table + " WHERE idPaciente = "+idPaciente+" AND dataFinalizacao IS NULL AND dataCancelamento IS NULL AND idEstabelecimento = "+idEstabelecimento+" AND idUsuario =" + usuario.id);
    this._connection.query("select * from "+this._table + " WHERE idPaciente = ? AND dataFinalizacao IS NULL AND dataCancelamento IS NULL AND idEstabelecimento = ? AND idUsuario = ?" ,[idPaciente,idEstabelecimento,usuario.id],callback); 
}

AtendimentoDAO.prototype.salva = function(objeto,callback) {
    this._connection.query("INSERT INTO "+this._table+" SET ?", objeto, callback);
}

AtendimentoDAO.prototype.atualiza = function(objeto,id, callback) {
    this._connection.query("UPDATE "+this._table+" SET ?  where id= ?", [objeto, id], callback);
}

AtendimentoDAO.prototype.finaliza = function(objeto,id, callback) {

    if(objeto.tipo == 'C'){
        this._connection.query("UPDATE "+this._table+" SET dataCancelamento = CURRENT_TIMESTAMP where id= ?", id, callback);

    } else if(objeto.tipo == 'F'){
        this._connection.query("UPDATE "+this._table+" SET dataFinalizacao = CURRENT_TIMESTAMP where id= ?", id, callback);
    }


}

AtendimentoDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}


module.exports = function(){
    return AtendimentoDAO;
};