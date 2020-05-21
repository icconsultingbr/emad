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

        if(addFilter.idPaciente){
            where+=" AND p.idPaciente = "+addFilter.idPaciente + " ";
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
        pro.nome, 
        a.situacao,
        p.idSap,
        a.tipoFicha,
        p.idPacienteCorrespondenteDim,
        YEAR(a.dataCriacao) as ano_receita,
        a.numeroReceita as numero_receita,
        e.idUnidadeRegistroReceitaDim as unidade_receita,
        pro.id as idProfissional
    FROM ${this._table} a 
    INNER JOIN tb_paciente p ON(a.idPaciente = p.id)  
    INNER JOIN tb_estabelecimento e ON(a.idEstabelecimento = e.id) 
    INNER JOIN tb_usuario u ON(a.idUsuario = u.id) 
    INNER JOIN tb_profissional pro on pro.idUsuario = u.id
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

        if(addFilter.idPaciente){
            where+=" AND p.idPaciente = "+addFilter.idPaciente + " ";
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
        pro.nome, 
        a.situacao, 
        p.idSap,
        a.tipoFicha,
        p.idPacienteCorrespondenteDim,
        YEAR(a.dataCriacao) as ano_receita,
        a.numeroReceita as numero_receita,
        e.idUnidadeRegistroReceitaDim as unidade_receita,
        pro.id as idProfissional
    FROM ${this._table} a 
    INNER JOIN tb_paciente p ON(a.idPaciente = p.id)  
    INNER JOIN tb_estabelecimento e ON(a.idEstabelecimento = e.id) 
    INNER JOIN tb_usuario u ON(a.idUsuario = u.id) 
    INNER JOIN tb_profissional pro on pro.idUsuario = u.id
    WHERE a.idUsuario = ? ${where} 
    ORDER BY a.id DESC`, id, callback);
}

AtendimentoDAO.prototype.buscaPorId = function (id,callback) {
    this._connection.query(`select p.nome,
                                YEAR(a.dataCriacao) as ano_receita,
                                a.numeroReceita as numero_receita,
                                e.idUnidadeRegistroReceitaDim as unidade_receita,
                                a.* from ${this._table} a 
    INNER JOIN tb_paciente p ON(a.idPaciente = p.id) 
    INNER JOIN tb_estabelecimento e ON(a.idEstabelecimento = e.id) 
    WHERE a.id = ?` ,id,callback); 
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
    if(objeto.tipo == 'X'){
        this._connection.query("UPDATE "+this._table+" SET dataCancelamento = CURRENT_TIMESTAMP, idUsuarioAlteracao=?, motivoCancelamento =?,  situacao=? where id= ?", [objeto.idUsuarioAlteracao, objeto.motivoCancelamento, objeto.tipo, id], callback);
    } else if(objeto.tipo == 'A' || objeto.tipo == 'E' || objeto.tipo == 'O'){
        this._connection.query("UPDATE "+this._table+" SET dataFinalizacao = CURRENT_TIMESTAMP, idUsuarioAlteracao=?, motivoCancelamento='', situacao =? where id= ?", [objeto.idUsuarioAlteracao, objeto.tipo, id], callback);
    } 
}

AtendimentoDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}

AtendimentoDAO.prototype.buscaCabecalhoReceitaDim = function (id, callback) {
    this._connection.query(`SELECT 
                                YEAR(now()) as ano,
                                est.idUnidadeRegistroReceitaDim as unidade,
                                pac.idPacienteCorrespondenteDim as paciente,
                                pro.idProfissionalCorrespondenteDim as prescritor,
                                0 as id_mandado_judicial,
                                6 as id_login, 
                                pac.idPacienteCorrespondenteDim as id_paciente,
                                est.idUnidadeRegistroReceitaDim as id_unidade_sistema,
                                UUID() as num_controle,
                                mun.nome cidade,
                                mun.uf      
                            from tb_atendimento atend
                            inner join tb_estabelecimento est on est.id = atend.idEstabelecimento 
                            inner join tb_paciente pac on pac.id = atend.idPaciente 
                            inner join tb_usuario usu on usu.id = atend.idUsuario
                            inner join tb_profissional pro on pro.idUsuario = usu.id
                            inner join tb_municipio mun on mun.id = est.idMunicipio 
                            WHERE  atend.id = ?
                            and exists (select 1 from tb_atendimento_medicamento tam where tam.idAtendimento = atend.id and enviado=0)` , id, callback); 
}

AtendimentoDAO.prototype.buscaDadosFichaAtendimento = function (command, id ,callback) {
    this._connection.query(command + id,callback);
}

AtendimentoDAO.prototype.buscaProfissionalAberturaAtendimento = function (idUsuario, idAtendimento, callback) {    
    this._connection.query(`select 1 from tb_atendimento atend 
    inner join tb_profissional proAbertura on proAbertura.idUsuario = atend.idUsuario 
    inner join tb_profissional proAlteracao on proAlteracao.idUsuario = ?
    where atend.id = ? and (proAbertura.idUsuario = proAlteracao.idUsuario || proAbertura.situacao = 0)` ,[idUsuario,idAtendimento],callback); 
}



module.exports = function(){
    return AtendimentoDAO;
};