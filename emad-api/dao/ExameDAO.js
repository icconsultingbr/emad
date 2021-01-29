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
    let result =  await this._connection.query(`SELECT a.*, pac.nome nomePaciente 
                                                FROM ${this._table} a inner join tb_paciente pac on pac.id = a.idPaciente where a.id=?`, [id]);
    return result ? result[0] : null;
}

ExameDAO.prototype.atualizaStatus = async function(obj){
    const response =  await this._connection.query(`UPDATE tb_exame SET situacao = ?, idUsuarioAlteracao = ?, dataAlteracao  = ?, situacao = ?, resultado = ? WHERE id= ?`, [obj.situacao, obj.idUsuarioAlteracao, obj.dataAlteracao, obj.situacao, obj.resultado, obj.id]);
    return [response];
}

// ExameDAO.prototype.atualizaStatus = async function(obj){
//     const receitaAtualizada =  await this._connection.query(`UPDATE tb_receita SET situacao = ?, idUsuarioAlteracao = ?, dataAlteracao  = ?, dataUltimaDispensacao = ? WHERE id= ?`, [obj.situacao, obj.idUsuarioAlteracao, obj.dataAlteracao, obj.dataUltimaDispensacao,  obj.id]);
//     return [receitaAtualizada];
// }

// ExameDAO.prototype.atualiza = function(obj, id, callback) {
//     this._connection.query(`UPDATE ${this._table} SET     
//     idEstabelecimento = ?, idUf = ?, idMunicipio = ?, idProfissional = ?, idPaciente = ?, 
//     idSubgrupoOrigem = ?, dataEmissao = ?, situacao = ?, idUsuarioAlteracao = ?, dataAlteracao  = ?
//     WHERE id= ?`, [obj.idEstabelecimento, obj.idUf, obj.idMunicipio, obj.idProfissional,
//         obj.idPaciente, obj.idSubgrupoOrigem, new Date(obj.dataEmissao), obj.situacao, obj.idUsuarioAlteracao, obj.dataAlteracao, id],
//         callback);
// }



// ExameDAO.prototype.buscaReciboReceita = async function (ano, idEstabelecimento, numero) {
//     const receita = await  this._connection.query(`SELECT                             
//                             a.id
//                             ,a.idEstabelecimento
//                             ,estabelecimento.nomeFantasia nomeEstabelecimento
//                             ,a.idMunicipio
//                             ,municipio.nome nomeMunicipio
//                             ,a.idProfissional
//                             ,profissional.nome nomeProfissional
//                             ,a.idPaciente
//                             ,paciente.nome nomePaciente
//                             ,a.idSubgrupoOrigem
//                             ,subgrupoOrigem.nome nomeSubgrupoOrigem
//                             ,a.ano
//                             ,a.numero
//                             ,a.dataEmissao
//                             ,a.dataUltimaDispensacao
//                             ,a.idMotivoFimReceita
//                             ,a.idPacienteOrigem
//                             ,pacienteOrigem.nome nomePacienteOrigem
//                             ,a.idMandadoJudicial                            
//                             ,a.situacao
//                             ,a.idUf
//                             ,CONCAT(municipio.nome,'/',uf.uf) textoCidade
//                             ,movimento.id idMovimentoGeral
//                             ,paciente.cartaoSus as cartaoSusPaciente
//                             ,paciente.dataNascimento
//                             ,YEAR(CURRENT_TIMESTAMP) - YEAR(paciente.dataNascimento ) - (RIGHT(CURRENT_TIMESTAMP, 5) < RIGHT(paciente.dataNascimento, 5)) as pacienteIdade
//                             ,paciente.idSap                            
//                             FROM ${this._table} a
//                             INNER JOIN tb_estabelecimento estabelecimento ON (a.idEstabelecimento = estabelecimento.id)
//                             INNER JOIN tb_municipio municipio ON (a.idMunicipio = municipio.id)
//                             INNER JOIN tb_profissional profissional ON (a.idProfissional = profissional.id)
//                             INNER JOIN tb_paciente paciente ON (a.idPaciente = paciente.id)
//                             INNER JOIN tb_subgrupo_origem subgrupoOrigem ON (a.idSubgrupoOrigem = subgrupoOrigem.id)
//                             LEFT JOIN tb_paciente pacienteOrigem ON (a.idPacienteOrigem = paciente.id)                                                         
//                             INNER JOIN tb_uf uf on uf.id = a.idUf
//                             LEFT JOIN tb_movimento_geral movimento ON (movimento.idReceita = a.id)
//                             WHERE a.ano = ? and a.idEstabelecimento=? and a.numero=?`, [ano, idEstabelecimento, numero]);
//     return receita;
// }

// ExameDAO.prototype.buscaPorPacienteIdProntuario = async function (idPaciente) {    
//     const response =  await this._connection.query(`select 
//                                 a.id
//                                 ,a.idEstabelecimento
//                                 ,estabelecimento.nomeFantasia nomeEstabelecimento
//                                 ,a.idProfissional
//                                 ,profissional.nome nomeProfissional
//                                 ,a.ano
//                                 ,a.numero
//                                 ,a.dataEmissao
//                                 ,a.idAtendimento                                
//                                 ,CASE  
//                                 WHEN a.situacao = '1'  THEN 'Pendente medicamentos'  
//                                 WHEN a.situacao = '2'  THEN 'Aberta'                                                                  
//                                 ELSE 'Finalizada'
//                                 END as situacaoNome
//     from ${this._table} a     
//     INNER JOIN tb_item_receita tir ON (a.id = tir.idReceita)
//     INNER JOIN tb_material material ON (tir.idMaterial = material.id)
//     INNER JOIN tb_profissional profissional ON (a.idProfissional = profissional.id)
//     INNER JOIN tb_estabelecimento estabelecimento ON (a.idEstabelecimento = estabelecimento.id)
//     WHERE a.idPaciente = ? order by a.id desc`, idPaciente); 
//     return response;
// }

// ExameDAO.prototype.buscaDominio = function (callback) {
//     this._connection.query(`SELECT id, nome FROM ${this._table} WHERE situacao = 1`, callback);
// }

// ExameDAO.prototype.deletaPorId = function (id,callback) {
//     this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
// }


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
                                                WHEN a.situacao = '2'  THEN 'Amostra reagente'                                  
                                                ELSE 'Não realizado'
                                            END as resultadoNome              
                                            ${join}`, orderBy, addFilter.sortOrder, addFilter.limit, addFilter.offset);

    const result = await this._connection.query(query);

    return {
        total: count[0].total,
        items: result
    }
}

// ExameDAO.prototype.buscaPorPacienteIdProntuarioVacinacao = async function (idPaciente) {    
//     const response =  await this._connection.query(`SELECT 
//         a.id
//         ,a.idEstabelecimento
//         ,estabelecimento.nomeFantasia nomeEstabelecimento
//         ,a.idProfissional
//         ,profissional.nome nomeProfissional
//         ,material.codigo 
//         ,material.descricao 
//         ,tir.qtdPrescrita 
//         ,tir.qtdDispAnterior
//         ,tir.dataUltDisp 
//     from ${this._table} a     
//     INNER JOIN tb_item_receita tir ON (a.id = tir.idReceita)
//     INNER JOIN tb_material material ON (tir.idMaterial = material.id)
//     INNER JOIN tb_profissional profissional ON (a.idProfissional = profissional.id)
//     INNER JOIN tb_estabelecimento estabelecimento ON (a.idEstabelecimento = estabelecimento.id)
//     WHERE a.idPaciente = ? AND material.vacina = 1 order by a.id desc`, idPaciente); 
//     return response;
// }
// ExameDAO.prototype.buscaCarteiraVacinacaoPorPaciente = async function (idPaciente) {    
//     const response =  await this._connection.query(`SELECT 
//     tm.descricao 
//     ,tr.dataUltimaDispensacao 
//     FROM tb_receita tr     
//     INNER JOIN tb_item_receita tir ON (tr.id = tir.idReceita)
//     INNER JOIN tb_material tm ON (tir.idMaterial = tm.id)
//     WHERE tm.vacina = 1 AND tr.idPaciente = ?`, idPaciente); 
    
//     const pivoted = response.reduce((prev, cur) => {

//         let existing = prev.find(x => x.descricao === cur.descricao);
      
//         if (existing)
//           existing.datasUltimaDispensacao.push(cur.dataUltimaDispensacao)
//         else
//           prev.push({
//             descricao: cur.descricao,
//             datasUltimaDispensacao: [cur.dataUltimaDispensacao]
//           });
      
//         return prev;
//       }, []);

//     return pivoted;
// }

module.exports = function(){
    return ExameDAO;
};