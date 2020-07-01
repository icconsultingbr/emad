function ReceitaDAO(connection) {
    this._connection = connection;
    this._table = `tb_receita`;
}

ReceitaDAO.prototype.salva = async function(receita) {
    const novaReceita = await this._connection.query(`INSERT INTO tb_receita (idEstabelecimento, idUf, idMunicipio, idProfissional, idPaciente, 
                                                          idSubgrupoOrigem, ano, numero, dataEmissao, situacao, idUsuarioCriacao, dataCriacao)
                                                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                                                          [receita.idEstabelecimento, receita.idUf, receita.idMunicipio, receita.idProfissional,
                                                           receita.idPaciente, receita.idSubgrupoOrigem, receita.ano, receita.numero, 
                                                           new Date(receita.dataEmissao), receita.situacao, receita.idUsuarioCriacao, receita.dataCriacao]);

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
                            FROM ${this._table} a
                            INNER JOIN tb_estabelecimento estabelecimento ON (a.idEstabelecimento = estabelecimento.id)
                            INNER JOIN tb_municipio municipio ON (a.idMunicipio = municipio.id)
                            INNER JOIN tb_profissional profissional ON (a.idProfissional = profissional.id)
                            INNER JOIN tb_paciente paciente ON (a.idPaciente = paciente.id)
                            INNER JOIN tb_subgrupo_origem subgrupoOrigem ON (a.idSubgrupoOrigem = subgrupoOrigem.id)
                            LEFT JOIN tb_paciente pacienteOrigem ON (a.idPacienteOrigem = paciente.id)                                                         
                            INNER JOIN tb_uf uf on uf.id = a.idUf
                            WHERE a.id = ?`, id);

    return receita;
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
                            FROM ${this._table} a
                            INNER JOIN tb_estabelecimento estabelecimento ON (a.idEstabelecimento = estabelecimento.id)
                            INNER JOIN tb_municipio municipio ON (a.idMunicipio = municipio.id)
                            INNER JOIN tb_profissional profissional ON (a.idProfissional = profissional.id)
                            INNER JOIN tb_paciente paciente ON (a.idPaciente = paciente.id)
                            INNER JOIN tb_subgrupo_origem subgrupoOrigem ON (a.idSubgrupoOrigem = subgrupoOrigem.id)
                            LEFT JOIN tb_paciente pacienteOrigem ON (a.idPacienteOrigem = paciente.id)
                            INNER JOIN tb_uf uf on uf.id = a.idUf
                            WHERE 1=1 ${where}
                            ORDER BY a.id desc`, callback);
}
module.exports = function(){
    return ReceitaDAO;
};