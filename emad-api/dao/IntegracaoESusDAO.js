
function IntegracaoESusDAO(connection, tipoCampoData) {
   this._connection = connection;
   this.campoData = tipoCampoData;
}

IntegracaoESusDAO.prototype.listaCadastroIndividual = async function (filtro) {
   return await this._connection.query(`SELECT * FROM vw_cadastro_individual_sus vw WHERE (cpfCidadao IS NOT NULL OR cnsCidadao IS NOT NULL) and idEstabelecimentoCadastro = ? AND ${this.campoData} BETWEEN ? AND ? `, [filtro.idEstabelecimento, filtro.periodoExtracao[0], filtro.periodoExtracao[1]]);
}

IntegracaoESusDAO.prototype.listaAtendimentoIndividual = async function (filtro) {
   let listaAtendimentoIndividual = {};
   listaAtendimentoIndividual.atendimentos = await this._connection.query(`SELECT vw.* FROM vw_atendimento_individual_sus vw WHERE ${this.campoData} BETWEEN ? AND ?  AND idEstabelecimento = ?  ORDER BY dataCriacao asc`, [filtro.periodoExtracao[0], filtro.periodoExtracao[1], filtro.idEstabelecimento]);
   listaAtendimentoIndividual.condicaoAvaliacao = await this._connection.query(`SELECT vw.* FROM vw_problema_condicao_avaliacao_sus vw
                                                                                 INNER JOIN tb_atendimento ta ON (ta.id = vw.idAtendimento)
                                                                                 WHERE ta.idEstabelecimento = ?`, [filtro.idEstabelecimento]);
   listaAtendimentoIndividual.condicaoCiaps = await this._connection.query(`SELECT vw.* FROM vw_ciaps_sus vw
                                                                                 INNER JOIN tb_atendimento ta ON (ta.id = vw.idAtendimento)
                                                                                 WHERE ta.idEstabelecimento = ?`, [filtro.idEstabelecimento]);
   listaAtendimentoIndividual.condutaSus = await this._connection.query(`SELECT vw.* FROM vw_condutas_sus vw 
                                                                                 INNER JOIN tb_atendimento ta ON (ta.id = vw.idAtendimento)
                                                                                 WHERE vw.condutas IS NOT NULL and ta.idEstabelecimento = ?`, [filtro.idEstabelecimento]);

   listaAtendimentoIndividual.solicitacoesExames = await this._connection.query(`SELECT vw.* FROM vw_exames_sus vw 
                                                                                 WHERE ${this.campoData} BETWEEN ? AND ?  AND idEstabelecimento = ?`, [filtro.periodoExtracao[0], filtro.periodoExtracao[1], filtro.idEstabelecimento]);

   listaAtendimentoIndividual.medicamentos = await this._connection.query(`SELECT vw.* FROM vw_medicamentos_sus vw 
                                                                                 WHERE ${this.campoData} BETWEEN ? AND ?  AND idEstabelecimento = ?`, [filtro.periodoExtracao[0], filtro.periodoExtracao[1], filtro.idEstabelecimento]);

   return listaAtendimentoIndividual;
}


IntegracaoESusDAO.prototype.listaAtividadeColetiva = async function (filtro) {
   let listaAtividadeColetiva = {};
   listaAtividadeColetiva.atendimentos = await this._connection.query(`SELECT * FROM vw_atividade_coletiva_sus vw WHERE ${this.campoData} BETWEEN ? AND ?  AND idEstabelecimento = ? AND tipoFicha = ?  ORDER BY dataCriacao asc`, [filtro.periodoExtracao[0], filtro.periodoExtracao[1], filtro.idEstabelecimento, 7]);
   return listaAtividadeColetiva;
}

IntegracaoESusDAO.prototype.listaAtividadeColetivaParticipantes = async function (idEstabelecimento) {
   let listaAtividadeColetivaParticipantes = {};
   listaAtividadeColetivaParticipantes = await this._connection.query(`SELECT * FROM vw_atividade_coletiva_participantes vw WHERE idEstabelecimento=?`, [idEstabelecimento]);
   return listaAtividadeColetivaParticipantes;
}

IntegracaoESusDAO.prototype.listaVacinas = async function (filtro) {
   let listaVacinas = {};
   listaVacinas.vacinas = await this._connection.query(`SELECT * FROM vw_vacina_sus WHERE dataFinalizacao IS NOT NULL AND ${this.campoData} BETWEEN ? AND ? AND idEstabelecimento = ?`, [filtro.periodoExtracao[0], filtro.periodoExtracao[1], filtro.idEstabelecimento]);
   listaVacinas.vacinaChild = await this._connection.query(`SELECT * FROM vw_vacina_child_sus`);
   return listaVacinas;
}

IntegracaoESusDAO.prototype.listaProcedimentos = async function (filtro) {
   let listaProcedimentos = {};
   listaProcedimentos.atendimentos = await this._connection.query(`SELECT * FROM vw_atendimento_individual_sus vw WHERE ${this.campoData} BETWEEN ? AND ? AND 
   ( (exists (select 1 from vw_atendimento_afericoes_sus afer where afer.idAtendimento = vw.idAtendimento and 
   (
   (pressaoArterial is not null and pressaoArterial <> '') or (temperatura is not null and temperatura <> '') or (altura is not null and altura <> '') or (peso is not null and peso <> '')
   )
   ))) AND vw.idEstabelecimento = ? ORDER BY dataCriacao asc`, [filtro.periodoExtracao[0], filtro.periodoExtracao[1], filtro.idEstabelecimento] );
   listaProcedimentos.procedimentos = await this._connection.query(`SELECT tap.idAtendimento, tp.co_procedimento, sum(tap.qtd), tap.situacao, tp2.id idProfissional FROM tb_atendimento_procedimento tap
                                                                     INNER JOIN tb_procedimento tp ON (tap.idProcedimento = tp.id and tap.situacao=1)
                                                                     INNER JOIN tb_usuario tu on tu.id = tap.idUsuarioCriacao 
                                                                     INNER JOIN tb_profissional tp2 on tp2.idUsuario = tu.id
                                                                     group by tap.idAtendimento, tp.co_procedimento, tap.situacao, tp2.id`);
   listaProcedimentos.atendimentoProcedimentos = await this._connection.query(`select * from (
                                                                                 SELECT distinct vw.idAtendimento, vw.idEstabelecimento, vw.cartaoSus, vw.dataNascimento, vw.localDeAtendimentoSus,
                                                                                 vw.sexo, vw.turno, vw.tipoAtendimentoSus, vw.dataCriacao, vw.dataFinalizacao, vw.cpfCidadao,
                                                                                 tp2.id idProfissionalFiltro FROM vw_atendimento_individual_sus vw
                                                                                 inner join tb_atendimento_procedimento tap on tap.idAtendimento = vw.idAtendimento 
                                                                                 INNER JOIN tb_procedimento tp ON (tap.idProcedimento = tp.id and tap.situacao=1)
                                                                                 INNER JOIN tb_usuario tu on tu.id = tap.idUsuarioCriacao 
                                                                                 INNER JOIN tb_profissional tp2 on tp2.idUsuario = tu.id
                                                                                 UNION ALL
                                                                                 SELECT distinct vw.idAtendimento, vw.idEstabelecimento, vw.cartaoSus, vw.dataNascimento, vw.localDeAtendimentoSus,
                                                                                 vw.sexo, vw.turno, vw.tipoAtendimentoSus, vw.dataCriacao, vw.dataFinalizacao, vw.cpfCidadao,
                                                                                 tp2.id idProfissionalFiltro FROM vw_atendimento_odontologico_individual_sus vw
                                                                                 inner join tb_atendimento_procedimento tap on tap.idAtendimento = vw.idAtendimento 
                                                                                 INNER JOIN tb_procedimento tp ON (tap.idProcedimento = tp.id and tap.situacao=1)
                                                                                 INNER JOIN tb_usuario tu on tu.id = tap.idUsuarioCriacao 
                                                                                 INNER JOIN tb_profissional tp2 on tp2.idUsuario = tu.id
                                                                                 UNION ALL
                                                                                 SELECT distinct vw.idAtendimento, vw.idEstabelecimento, vw.cartaoSus, vw.dataNascimento, vw.localDeAtendimentoSus,
                                                                                 vw.sexo, vw.turno, vw.tipoAtendimentoSus, vw.dataCriacao, vw.dataFinalizacao, vw.cpfCidadao,
                                                                                 tp2.id idProfissionalFiltro FROM vw_atendimento_domiciliar_sus vw
                                                                                 inner join tb_atendimento_procedimento tap on tap.idAtendimento = vw.idAtendimento 
                                                                                 INNER JOIN tb_procedimento tp ON (tap.idProcedimento = tp.id and tap.situacao=1)
                                                                                 INNER JOIN tb_usuario tu on tu.id = tap.idUsuarioCriacao 
                                                                                 INNER JOIN tb_profissional tp2 on tp2.idUsuario = tu.id) a
                                                                                 ORDER BY a.dataCriacao asc`);
   listaProcedimentos.numTotalAfericaoPa = await this._connection.query(`SELECT count(1) qtd, vw.idProfissional FROM vw_atendimento_afericoes_sus vw INNER JOIN tb_atendimento ta ON (ta.id = vw.idAtendimento) WHERE vw.pressaoArterial is not null and vw.pressaoArterial <> '' and vw.${this.campoData} BETWEEN ? AND ? AND ta.idEstabelecimento = ? group by vw.idProfissional`, [filtro.periodoExtracao[0], filtro.periodoExtracao[1], filtro.idEstabelecimento]);
   listaProcedimentos.numTotalAfericaoTemperatura = await this._connection.query(`SELECT count(1) qtd, vw.idProfissional FROM vw_atendimento_afericoes_sus vw INNER JOIN tb_atendimento ta ON (ta.id = vw.idAtendimento) WHERE vw.temperatura is not null and vw.temperatura <> '' and vw.${this.campoData} BETWEEN ? AND ? AND ta.idEstabelecimento = ?  group by vw.idProfissional`, [filtro.periodoExtracao[0], filtro.periodoExtracao[1], filtro.idEstabelecimento]);
   listaProcedimentos.numTotalMedicaoAltura = await this._connection.query(`SELECT count(1) qtd, vw.idProfissional FROM vw_atendimento_afericoes_sus vw INNER JOIN tb_atendimento ta ON (ta.id = vw.idAtendimento) WHERE vw.altura is not null and vw.altura <> '' and vw.${this.campoData} BETWEEN ? AND ? AND ta.idEstabelecimento = ?  group by vw.idProfissional`, [filtro.periodoExtracao[0], filtro.periodoExtracao[1], filtro.idEstabelecimento]);
   listaProcedimentos.numTotalMedicaoPeso = await this._connection.query(`SELECT count(1) qtd, vw.idProfissional  FROM vw_atendimento_afericoes_sus vw INNER JOIN tb_atendimento ta ON (ta.id = vw.idAtendimento) WHERE vw.peso is not null and vw.peso <> '' and vw.${this.campoData} BETWEEN ? AND ? AND ta.idEstabelecimento = ?  group by vw.idProfissional`, [filtro.periodoExtracao[0], filtro.periodoExtracao[1], filtro.idEstabelecimento]);

   return listaProcedimentos;
}

IntegracaoESusDAO.prototype.listaAtendimentoOdontologicoIndividual = async function (filtro) {
   let listaAtendimentoOdontologicoIndividual = {};
   listaAtendimentoOdontologicoIndividual.atendimentos = await this._connection.query(`SELECT * FROM vw_atendimento_odontologico_individual_sus vw WHERE ${this.campoData} BETWEEN ? AND ?  AND idEstabelecimento = ? ORDER BY dataCriacao asc`, [filtro.periodoExtracao[0], filtro.periodoExtracao[1], filtro.idEstabelecimento]);
   return listaAtendimentoOdontologicoIndividual;
}

IntegracaoESusDAO.prototype.listAtendimentoTipoFornecimentoOdonto = async function (idEstabelecimento) {
   let listaTipoFornecimento = {};
   listaTipoFornecimento = await this._connection.query(`SELECT * FROM vw_atendimento_tipo_fornecimento_odonto vw WHERE idEstabelecimento=?`, [idEstabelecimento]);
   return listaTipoFornecimento;
}

IntegracaoESusDAO.prototype.listAtendimentoTipoVigilanciaOdonto = async function (idEstabelecimento) {
   let listaTipoVigilancia = {};
   listaTipoVigilancia = await this._connection.query(`SELECT * FROM vw_atendimento_tipo_vigilancia_odonto vw WHERE idEstabelecimento=?`, [idEstabelecimento]);
   return listaTipoVigilancia;
}

IntegracaoESusDAO.prototype.listaAtendimentoDomiciliar = async function (filtro) {
   let listaAtendimentoDomiciliar = {};
   listaAtendimentoDomiciliar.atendimentos = await this._connection.query(`SELECT * FROM vw_atendimento_domiciliar_sus vw WHERE ${this.campoData} BETWEEN ? AND ?  AND idEstabelecimento = ?  ORDER BY dataCriacao asc`, [filtro.periodoExtracao[0], filtro.periodoExtracao[1], filtro.idEstabelecimento]);
   listaAtendimentoDomiciliar.procedimentos = await this._connection.query(`SELECT tap.idAtendimento, tp.co_procedimento, tap.qtd, tap.situacao FROM tb_atendimento_procedimento tap
                                                                            INNER JOIN tb_atendimento ta ON (ta.id = tap.idAtendimento)
                                                                            INNER JOIN tb_procedimento tp ON (tap.idProcedimento = tp.id) WHERE ta.idEstabelecimento = ?`, [filtro.idEstabelecimento]);
   listaAtendimentoDomiciliar.condicaoAvaliacao = await this._connection.query(`SELECT vw.* FROM vw_problema_condicao_avaliacao_sus vw
                                                                                 INNER JOIN tb_atendimento ta ON (ta.id = vw.idAtendimento)
                                                                                 WHERE ta.idEstabelecimento = ?`, [filtro.idEstabelecimento]);
   listaAtendimentoDomiciliar.condicaoCiaps = await this._connection.query(`SELECT vw.* FROM vw_ciaps_sus vw
                                                                              INNER JOIN tb_atendimento ta ON (ta.id = vw.idAtendimento)
                                                                              WHERE ta.idEstabelecimento = ?`, [filtro.idEstabelecimento]);                                                                            
   return listaAtendimentoDomiciliar;
}

module.exports = function () {
   return IntegracaoESusDAO;
};