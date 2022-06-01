
function IntegracaoESusDAO(connection, tipoCampoData) {
   this._connection = connection;
   this.campoData = tipoCampoData;
}

IntegracaoESusDAO.prototype.listaCadastroIndividual = async function (filtro) {
   return await this._connection.query(`SELECT * FROM vw_cadastro_individual_sus vw WHERE (cpfCidadao IS NOT NULL OR cnsCidadao IS NOT NULL) and idEstabelecimentoCadastro = ? AND ${this.campoData} BETWEEN ? AND ? `, [filtro.idEstabelecimento, filtro.periodoExtracao[0], filtro.periodoExtracao[1]]);
}

IntegracaoESusDAO.prototype.listaAtendimentoIndividual = async function (filtro) {
   let listaAtendimentoIndividual = {};
   listaAtendimentoIndividual.atendimentos = await this._connection.query(`SELECT * FROM vw_atendimento_individual_sus vw WHERE ${this.campoData} BETWEEN ? AND ?  AND idEstabelecimento = ?`, [filtro.periodoExtracao[0], filtro.periodoExtracao[1], filtro.idEstabelecimento]);
   listaAtendimentoIndividual.condicaoAvaliacao = await this._connection.query(`SELECT * FROM vw_problema_condicao_avaliacao_sus vw`);
   listaAtendimentoIndividual.condicaoCiaps = await this._connection.query(`SELECT * FROM vw_ciaps_sus vw`);
   listaAtendimentoIndividual.condutaSus = await this._connection.query(`SELECT * FROM vw_condutas_sus vw WHERE condutas IS NOT NULL`);
   return listaAtendimentoIndividual;
}


IntegracaoESusDAO.prototype.listaAtividadeColetiva = async function (filtro) {
   let listaAtividadeColetiva = {};
   listaAtividadeColetiva.atendimentos = await this._connection.query(`SELECT * FROM vw_atividade_coletiva_sus vw WHERE ${this.campoData} BETWEEN ? AND ?  AND idEstabelecimento = ? AND tipoFicha = ?`, [filtro.periodoExtracao[0], filtro.periodoExtracao[1], filtro.idEstabelecimento, 7]);
   return listaAtividadeColetiva;
}

IntegracaoESusDAO.prototype.listaAtividadeColetivaParticipantes = async function (idEstabelecimento) {
   let listaAtividadeColetivaParticipantes = {};
   listaAtividadeColetivaParticipantes = await this._connection.query(`SELECT * FROM vw_atividade_coletiva_participantes vw WHERE idEstabelecimento=?`, [idEstabelecimento]);
   return listaAtividadeColetivaParticipantes;
}

IntegracaoESusDAO.prototype.listaVacinas = async function (filtro) {
   let listaVacinas = {};
   listaVacinas.vacinas = await this._connection.query(`SELECT * FROM vw_vacina_sus WHERE dataUltimaDispensacao IS NOT NULL AND ${this.campoData} BETWEEN ? AND ?`, [filtro.periodoExtracao[0], filtro.periodoExtracao[1]]);
   listaVacinas.vacinaChild = await this._connection.query(`SELECT * FROM vw_vacina_child_sus`);
   return listaVacinas;
}

IntegracaoESusDAO.prototype.listaProcedimentos = async function (filtro) {
   let listaProcedimentos = {};
   listaProcedimentos.atendimentos = await this._connection.query(`SELECT * FROM vw_atendimento_individual_sus vw WHERE ${this.campoData} BETWEEN ? AND ? ORDER BY dataCriacao desc`, [filtro.periodoExtracao[0], filtro.periodoExtracao[1]] );
   listaProcedimentos.procedimentos = await this._connection.query(`SELECT tap.idAtendimento, tp.co_procedimento, tap.qtd, tap.situacao FROM tb_atendimento_procedimento tap
                                                                  INNER JOIN tb_procedimento tp ON (tap.idProcedimento = tp.id)`);
   listaProcedimentos.numTotalAfericaoPa = await this._connection.query(`SELECT count(1) qtd, idProfissional FROM vw_atendimento_afericoes_sus vw WHERE pressaoArterial is not null and pressaoArterial <> '' and ${this.campoData} BETWEEN ? AND ? group by idProfissional`, [filtro.periodoExtracao[0], filtro.periodoExtracao[1]]);
   listaProcedimentos.numTotalAfericaoTemperatura = await this._connection.query(`SELECT count(1) qtd, idProfissional FROM vw_atendimento_afericoes_sus vw WHERE temperatura is not null and temperatura <> '' and ${this.campoData} BETWEEN ? AND ? group by idProfissional`, [filtro.periodoExtracao[0], filtro.periodoExtracao[1]]);
   listaProcedimentos.numTotalMedicaoAltura = await this._connection.query(`SELECT count(1) qtd, idProfissional FROM vw_atendimento_afericoes_sus vw WHERE altura is not null and altura <> '' and ${this.campoData} BETWEEN ? AND ? group by idProfissional`, [filtro.periodoExtracao[0], filtro.periodoExtracao[1]]);
   listaProcedimentos.numTotalMedicaoPeso = await this._connection.query(`SELECT count(1) qtd,idProfissional  FROM vw_atendimento_afericoes_sus vw WHERE peso is not null and peso <> '' and ${this.campoData} BETWEEN ? AND ? group by idProfissional`, [filtro.periodoExtracao[0], filtro.periodoExtracao[1]]);

   return listaProcedimentos;
}

IntegracaoESusDAO.prototype.listaAtendimentoOdontologicoIndividual = async function (filtro) {
   let listaAtendimentoOdontologicoIndividual = {};
   listaAtendimentoOdontologicoIndividual.atendimentos = await this._connection.query(`SELECT * FROM vw_atendimento_odontologico_individual_sus vw WHERE ${this.campoData} BETWEEN ? AND ?  AND idEstabelecimento = ?`, [filtro.periodoExtracao[0], filtro.periodoExtracao[1], filtro.idEstabelecimento]);
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
   listaAtendimentoDomiciliar.atendimentos = await this._connection.query(`SELECT * FROM vw_atendimento_domiciliar_sus vw WHERE ${this.campoData} BETWEEN ? AND ?  AND idEstabelecimento = ?`, [filtro.periodoExtracao[0], filtro.periodoExtracao[1], filtro.idEstabelecimento]);
   listaAtendimentoDomiciliar.procedimentos = await this._connection.query(`SELECT tap.idAtendimento, tp.co_procedimento, tap.qtd, tap.situacao FROM tb_atendimento_procedimento tap
                                                                            INNER JOIN tb_procedimento tp ON (tap.idProcedimento = tp.id)`);
   listaAtendimentoDomiciliar.condicaoAvaliacao = await this._connection.query(`SELECT * FROM vw_problema_condicao_avaliacao_sus vw`);
   listaAtendimentoDomiciliar.condicaoCiaps = await this._connection.query(`SELECT * FROM vw_ciaps_sus vw`);                                                                            
   return listaAtendimentoDomiciliar;
}

module.exports = function () {
   return IntegracaoESusDAO;
};