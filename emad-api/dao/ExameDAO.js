const QueryBuilder = require('../infrastructure/QueryBuilder');

function ExameDAO(connection) {
    this._connection = connection;
    this._table = `tb_exame`;
}

ExameDAO.prototype.salva = async function(exame) {
    const response = await this._connection.query(`INSERT INTO tb_exame (idEstabelecimento, idPaciente, idTipoExame, situacao, idUsuarioCriacao, dataCriacao)
                                                          VALUES (?, ?, ?, ?, ?, ?)`, 
                                                          [exame.idEstabelecimento, exame.idPaciente,  exame.idTipoExame, exame.situacao, exame.idUsuarioCriacao, exame.dataCriacao]);
    return [response];
}

ExameDAO.prototype.buscaPorId = async function(id){
    let result =  await this._connection.query(`SELECT a.*, pac.nome nomePaciente, a.resultado resultadoFinal
                                                FROM ${this._table} a inner join tb_paciente pac on pac.id = a.idPaciente where a.id=?`, [id]);
    return result ? result[0] : null;
}

ExameDAO.prototype.atualizaStatus = async function(obj){
    const response =  await this._connection.query(`UPDATE tb_exame SET situacao = ?, idUsuarioAlteracao = ?, dataAlteracao  = ?, situacao = ?, resultado = ? WHERE id= ?`, [obj.situacao, obj.idUsuarioAlteracao, obj.dataAlteracao, obj.situacao, obj.resultado, obj.id]);
    return [response];
}

ExameDAO.prototype.buscaPorPacienteId = async function (idPaciente) {    
    const response =  await  this._connection.query(`select 
                                                        a.id, 
                                                        a.idPaciente, 
                                                        p.cartaoSus,
                                                        p.cpf, 
                                                        p.nome as nomePaciente, 
                                                        a.dataCriacao,                                            
                                                        a.idEstabelecimento, 
                                                        e.nomeFantasia estabelecimentoNome, 
                                                        a.idUsuarioCriacao, 
                                                        pro.nome nomeProfissional, 
                                                        a.situacao,
                                                        p.idSap,
                                                        a.idTipoExame,
                                                        tipoExame.nome nomeTipoExame,                                            
                                                        pro.id as idProfissional,
                                                        hipotese.nome nomeHipoteseDiagnostica,
                                                        a.resultado,
                                                        CASE  
                                                            WHEN a.situacao = '1'  THEN 'Aberto'  
                                                            WHEN a.situacao = '2'  THEN 'Finalizado'                                                                                          
                                                        END as situacaoNome,
                                                        CASE  
                                                            WHEN a.resultado = '1'  THEN 'Amostra não reagente'  
                                                            WHEN a.resultado = '2'  THEN 'Amostra reagente'                                  
                                                            ELSE 'Não realizado'
                                                        END as resultadoNome  
                                                        FROM tb_exame a
                                                        INNER JOIN tb_paciente p ON(a.idPaciente = p.id)  
                                                        INNER JOIN tb_estabelecimento e ON(a.idEstabelecimento = e.id) 
                                                        INNER JOIN tb_usuario u ON(a.idUsuarioCriacao = u.id) 
                                                        INNER JOIN tb_profissional pro on pro.idUsuario = u.id
                                                        INNER JOIN tb_tipo_exame tipoExame on tipoExame.id = a.idTipoExame
                                                        LEFT JOIN tb_hipotese_diagnostica hipotese on hipotese.id = a.idHipoteseDiagnostica 
                                                        WHERE a.idPaciente = ? AND a.situacao = 2` ,[idPaciente]); 

    return response;
}

ExameDAO.prototype.listar = async function(addFilter) { 
    let where = "";
    let offset = "";
    let orderBy = addFilter.sortColumn ? `${addFilter.sortColumn}` : "a.id";

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
            
            //if(addFilter.situacao == "0"){
                //orderBy = " cla.peso desc, a.dataCriacao ";
                //addFilter.sortOrder = "";
            //}
        }

        if(addFilter.idSap){
            where+=" AND p.idSap like '%"+addFilter.idSap+"%'";
        }

        if(addFilter.idPaciente){
            where+=" AND p.id = "+addFilter.idPaciente + " ";
        }

        if(addFilter.limit && addFilter.offset){
            offset = `LIMIT ${addFilter.limit} OFFSET ${addFilter.limit * addFilter.offset}`;
        }

        if (addFilter.pesquisaCentral) {
            where += ` AND (p.cartaoSus LIKE '%${addFilter.pesquisaCentral}%' OR
                            p.idSap LIKE '%${addFilter.pesquisaCentral}%' OR
                            UPPER(p.nome) LIKE UPPER('%${addFilter.pesquisaCentral}%') OR                            
                            UPPER(pro.nome) LIKE UPPER('%${addFilter.pesquisaCentral}%') OR   
                            UPPER(tipoExame.nome) LIKE UPPER('%${addFilter.pesquisaCentral}%') OR   
                            replace(replace(p.cpf,'.',''),'-','') LIKE replace(replace('%${addFilter.pesquisaCentral}%','.',''),'-','') OR
                            a.id LIKE '%${addFilter.pesquisaCentral}%')`;
        }
    }

    const join = ` FROM ${this._table} a 
    INNER JOIN tb_paciente p ON(a.idPaciente = p.id)  
    INNER JOIN tb_estabelecimento e ON(a.idEstabelecimento = e.id) 
    INNER JOIN tb_usuario u ON(a.idUsuarioCriacao = u.id) 
    INNER JOIN tb_profissional pro on pro.idUsuario = u.id
    INNER JOIN tb_tipo_exame tipoExame on tipoExame.id = a.idTipoExame
    LEFT JOIN tb_hipotese_diagnostica hipotese on hipotese.id = a.idHipoteseDiagnostica    
    WHERE 1=1  ${where} `;

    const count = await this._connection.query(`SELECT COUNT(1) as total ${join}`);

    const query = QueryBuilder.datatable(`SELECT 
                                            a.id, 
                                            a.idPaciente, 
                                            p.cartaoSus,
                                            p.cpf, 
                                            p.nome as nomePaciente, 
                                            a.dataCriacao,                                            
                                            a.idEstabelecimento, 
                                            e.nomeFantasia, 
                                            a.idUsuarioCriacao, 
                                            pro.nome nomeProfissional, 
                                            a.situacao,
                                            p.idSap,
                                            a.idTipoExame,
                                            tipoExame.nome nomeTipoExame,                                            
                                            pro.id as idProfissional,
                                            hipotese.nome nomeHipoteseDiagnostica,
                                            a.resultado,
                                            CASE  
                                                WHEN a.resultado = '1'  THEN 'Amostra não reagente'  
                                                WHEN a.resultado = '2'  THEN 'Amostra reagente'                                  
                                                ELSE 'Não realizado'
                                            END as resultadoNome              
                                            ${join}`, orderBy, addFilter.sortOrder, addFilter.limit, addFilter.offset);

    const result = await this._connection.query(query);

    return {
        total: count[0].total,
        items: result
    }
}


module.exports = function(){
    return ExameDAO;
};