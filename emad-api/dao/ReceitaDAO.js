function ReceitaDAO(connection) {
    this._connection = connection;
    this._table = `tb_receita`;
}

ReceitaDAO.prototype.salva = async function(receita) {
    const novaReceita = await this._connection.query(`INSERT INTO tb_receita (idEstabelecimento, idUf, idMunicipio, idProfissional, idPaciente, 
                                                          idSubgrupoOrigem, ano, numero, dataEmissao, situacao, idUsuarioCriacao, dataCriacao, idAtendimento, 
                                                          receitaExterna, nomeProfissionalExterno, profissionalExternoCrm, profissionalExternoCpf)
                                                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                                                          [receita.idEstabelecimento, receita.idUf, receita.idMunicipio, receita.idProfissional,
                                                           receita.idPaciente, receita.idSubgrupoOrigem, receita.ano, receita.numero, 
                                                           new Date(receita.dataEmissao), receita.situacao, receita.idUsuarioCriacao, receita.dataCriacao, receita.idAtendimento,
                                                           receita.receitaExterna, receita.nomeProfissionalExterno, receita.profissionalExternoCrm, receita.profissionalExternoCpf]);

    return [novaReceita];
}

ReceitaDAO.prototype.obterProximoNumero = async function(ano, idEstabelecimento){
    let numeroNovoResult =  await this._connection.query(`SELECT max(numero) as num FROM tb_receita where ano=? and idEstabelecimento=? FOR UPDATE`, [ano, idEstabelecimento]);

    return numeroNovoResult[0].num ? numeroNovoResult[0].num + 1 : 1;
}

ReceitaDAO.prototype.atualizaStatus = async function(obj){
    const receitaAtualizada =  await this._connection.query(`UPDATE tb_receita SET situacao = ?, idUsuarioAlteracao = ?, dataAlteracao  = ?, dataUltimaDispensacao = ? WHERE id= ?`, [obj.situacao, obj.idUsuarioAlteracao, obj.dataAlteracao, obj.dataUltimaDispensacao,  obj.id]);
    return [receitaAtualizada];
}

ReceitaDAO.prototype.atualiza = function(obj, id, callback) {
    this._connection.query(`UPDATE ${this._table} SET     
    idEstabelecimento = ?, idUf = ?, idMunicipio = ?, idProfissional = ?, idPaciente = ?, 
    idSubgrupoOrigem = ?, dataEmissao = ?, situacao = ?, idUsuarioAlteracao = ?, dataAlteracao  = ?
    WHERE id= ?`, [obj.idEstabelecimento, obj.idUf, obj.idMunicipio, obj.idProfissional,
        obj.idPaciente, obj.idSubgrupoOrigem, new Date(obj.dataEmissao), obj.situacao, obj.idUsuarioAlteracao, obj.dataAlteracao, id],
        callback);
}

ReceitaDAO.prototype.buscaPorId = async function (id) {
    const receita = await  this._connection.query(`SELECT                             
                            a.id
                            ,a.idEstabelecimento
                            ,estabelecimento.nomeFantasia nomeEstabelecimento
                            ,a.idMunicipio
                            ,municipio.nome nomeMunicipio
                            ,a.idProfissional
                            ,profissional.nome nomeProfissional
                            ,a.idPaciente
                            ,paciente.nome nomePaciente
                            ,a.idSubgrupoOrigem
                            ,subgrupoOrigem.nome nomeSubgrupoOrigem
                            ,a.ano
                            ,a.numero
                            ,a.dataEmissao
                            ,a.dataUltimaDispensacao
                            ,a.idMotivoFimReceita
                            ,a.idPacienteOrigem
                            ,pacienteOrigem.nome nomePacienteOrigem
                            ,a.idMandadoJudicial                            
                            ,a.situacao
                            ,a.idUf
                            ,CONCAT(municipio.nome,'/',uf.uf) textoCidade
                            ,a.receitaExterna
                            ,a.nomeProfissionalExterno
                            ,a.profissionalExternoCrm
                            ,a.profissionalExternoCpf
                            FROM ${this._table} a
                            INNER JOIN tb_estabelecimento estabelecimento ON (a.idEstabelecimento = estabelecimento.id)
                            INNER JOIN tb_municipio municipio ON (a.idMunicipio = municipio.id)
                            LEFT JOIN tb_profissional profissional ON (a.idProfissional = profissional.id)
                            INNER JOIN tb_paciente paciente ON (a.idPaciente = paciente.id)
                            INNER JOIN tb_subgrupo_origem subgrupoOrigem ON (a.idSubgrupoOrigem = subgrupoOrigem.id)
                            LEFT JOIN tb_paciente pacienteOrigem ON (a.idPacienteOrigem = paciente.id)                                                         
                            INNER JOIN tb_uf uf on uf.id = a.idUf
                            WHERE a.id = ?`, id);

    return receita;
}

ReceitaDAO.prototype.buscaReciboReceita = async function (ano, idEstabelecimento, numero) {
    const receita = await  this._connection.query(`SELECT                             
                            a.id
                            ,a.idEstabelecimento
                            ,estabelecimento.nomeFantasia nomeEstabelecimento
                            ,a.idMunicipio
                            ,municipio.nome nomeMunicipio
                            ,a.idProfissional
                            ,profissional.nome nomeProfissional
                            ,a.idPaciente
                            ,paciente.nome nomePaciente
                            ,a.idSubgrupoOrigem
                            ,subgrupoOrigem.nome nomeSubgrupoOrigem
                            ,a.ano
                            ,a.numero
                            ,a.dataEmissao
                            ,a.dataUltimaDispensacao
                            ,a.idMotivoFimReceita
                            ,a.idPacienteOrigem
                            ,pacienteOrigem.nome nomePacienteOrigem
                            ,a.idMandadoJudicial                            
                            ,a.situacao
                            ,a.idUf
                            ,CONCAT(municipio.nome,'/',uf.uf) textoCidade
                            ,movimento.id idMovimentoGeral
                            ,paciente.cartaoSus as cartaoSusPaciente
                            ,paciente.dataNascimento
                            ,YEAR(CURRENT_TIMESTAMP) - YEAR(paciente.dataNascimento ) - (RIGHT(CURRENT_TIMESTAMP, 5) < RIGHT(paciente.dataNascimento, 5)) as pacienteIdade
                            ,paciente.idSap
                            ,a.receitaExterna
                            ,a.nomeProfissionalExterno
                            ,a.profissionalExternoCrm
                            ,a.profissionalExternoCpf                            
                            FROM ${this._table} a
                            INNER JOIN tb_estabelecimento estabelecimento ON (a.idEstabelecimento = estabelecimento.id)
                            INNER JOIN tb_municipio municipio ON (a.idMunicipio = municipio.id)
                            LEFT JOIN tb_profissional profissional ON (a.idProfissional = profissional.id)
                            INNER JOIN tb_paciente paciente ON (a.idPaciente = paciente.id)
                            INNER JOIN tb_subgrupo_origem subgrupoOrigem ON (a.idSubgrupoOrigem = subgrupoOrigem.id)
                            LEFT JOIN tb_paciente pacienteOrigem ON (a.idPacienteOrigem = paciente.id)                                                         
                            INNER JOIN tb_uf uf on uf.id = a.idUf
                            LEFT JOIN tb_movimento_geral movimento ON (movimento.idReceita = a.id)
                            WHERE a.ano = ? and a.idEstabelecimento=? and a.numero=?`, [ano, idEstabelecimento, numero]);
    return receita;
}

ReceitaDAO.prototype.buscaPorPacienteIdProntuario = async function (idPaciente) {    
    const response =  await this._connection.query(`select 
                                a.id
                                ,a.idEstabelecimento
                                ,estabelecimento.nomeFantasia nomeEstabelecimento
                                ,a.idProfissional
                                ,profissional.nome nomeProfissional
                                ,a.ano
                                ,a.numero
                                ,a.dataEmissao
                                ,a.idAtendimento                                
                                ,CASE  
                                WHEN a.situacao = '1'  THEN 'Pendente medicamentos'  
                                WHEN a.situacao = '2'  THEN 'Aberta'                                                                  
                                ELSE 'Finalizada'
                                END as situacaoNome
    from ${this._table} a     
    INNER JOIN tb_item_receita tir ON (a.id = tir.idReceita)
    INNER JOIN tb_material material ON (tir.idMaterial = material.id)
    LEFT JOIN tb_profissional profissional ON (a.idProfissional = profissional.id)
    INNER JOIN tb_estabelecimento estabelecimento ON (a.idEstabelecimento = estabelecimento.id)
    WHERE a.idPaciente = ? order by a.id desc`, idPaciente); 
    return response;
}

ReceitaDAO.prototype.buscaDominio = function (callback) {
    this._connection.query(`SELECT id, nome FROM ${this._table} WHERE situacao = 1`, callback);
}

ReceitaDAO.prototype.deletaPorId = function (id,callback) {
    this._connection.query("UPDATE "+this._table+" set situacao = 0 WHERE id = ? ",id,callback);
}

ReceitaDAO.prototype.lista = function(addFilter, callback) {   
    let where = "";

    if(addFilter != null){   
        if (addFilter.idEstabelecimento && addFilter.idEstabelecimento != "undefined") {
            where+=" AND a.idEstabelecimento = " + addFilter.idEstabelecimento + "";
        }       
    }

    this._connection.query(`SELECT                             
                            a.id
                            ,a.idEstabelecimento
                            ,estabelecimento.nomeFantasia nomeEstabelecimento
                            ,a.idMunicipio
                            ,municipio.nome nomeMunicipio
                            ,a.idProfissional
                            ,profissional.nome nomeProfissional
                            ,a.idPaciente
                            ,paciente.nome nomePaciente
                            ,a.idSubgrupoOrigem
                            ,subgrupoOrigem.nome nomeSubgrupoOrigem
                            ,a.ano
                            ,a.numero
                            ,a.dataEmissao
                            ,a.dataUltimaDispensacao
                            ,a.idMotivoFimReceita
                            ,a.idPacienteOrigem
                            ,pacienteOrigem.nome nomePacienteOrigem
                            ,a.idMandadoJudicial                            
                            ,a.situacao
                            ,a.idUf
                            ,CONCAT(municipio.nome,'/',uf.uf) textoCidade
                            ,a.idAtendimento
                            FROM ${this._table} a
                            INNER JOIN tb_estabelecimento estabelecimento ON (a.idEstabelecimento = estabelecimento.id)
                            INNER JOIN tb_municipio municipio ON (a.idMunicipio = municipio.id)
                            LEFT JOIN tb_profissional profissional ON (a.idProfissional = profissional.id)
                            INNER JOIN tb_paciente paciente ON (a.idPaciente = paciente.id)
                            INNER JOIN tb_subgrupo_origem subgrupoOrigem ON (a.idSubgrupoOrigem = subgrupoOrigem.id)
                            LEFT JOIN tb_paciente pacienteOrigem ON (a.idPacienteOrigem = paciente.id)
                            INNER JOIN tb_uf uf on uf.id = a.idUf
                            WHERE 1=1 ${where}
                            ORDER BY a.id desc`, callback);
}
ReceitaDAO.prototype.buscaPorPacienteIdProntuarioVacinacao = async function (idPaciente) {    
    const response =  await this._connection.query(`SELECT 
        a.id
        ,a.idEstabelecimento
        ,estabelecimento.nomeFantasia nomeEstabelecimento
        ,a.idProfissional
        ,profissional.nome nomeProfissional
        ,material.codigo 
        ,material.descricao 
        ,tir.qtdPrescrita 
        ,tir.qtdDispAnterior
        ,tir.dataUltDisp 
    from ${this._table} a     
    INNER JOIN tb_item_receita tir ON (a.id = tir.idReceita)
    INNER JOIN tb_material material ON (tir.idMaterial = material.id)
    LEFT JOIN tb_profissional profissional ON (a.idProfissional = profissional.id)
    INNER JOIN tb_estabelecimento estabelecimento ON (a.idEstabelecimento = estabelecimento.id)
    WHERE a.idPaciente = ? AND material.vacina = 1 order by a.id desc`, idPaciente); 
    return response;
}
ReceitaDAO.prototype.buscaCarteiraVacinacaoPorPaciente = async function (idPaciente) {    
    const response =  await this._connection.query(`SELECT 
    tm.descricao 
    ,tr.dataUltimaDispensacao 
    FROM tb_receita tr     
    INNER JOIN tb_item_receita tir ON (tr.id = tir.idReceita)
    INNER JOIN tb_material tm ON (tir.idMaterial = tm.id)
    WHERE tm.vacina = 1 AND tr.idPaciente = ?`, idPaciente); 
    
    const pivoted = response.reduce((prev, cur) => {

        let existing = prev.find(x => x.descricao === cur.descricao);
      
        if (existing)
          existing.datasUltimaDispensacao.push(cur.dataUltimaDispensacao)
        else
          prev.push({
            descricao: cur.descricao,
            datasUltimaDispensacao: [cur.dataUltimaDispensacao]
          });
      
        return prev;
      }, []);

    return pivoted;
}
module.exports = function(){
    return ReceitaDAO;
};