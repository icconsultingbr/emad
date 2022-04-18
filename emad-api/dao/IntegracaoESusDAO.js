
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
   listaAtendimentoIndividual.condutaSus = await this._connection.query(`SELECT * FROM vw_condutas_sus vw WHERE condutas IS NOT NULL`);
   return listaAtendimentoIndividual;
}

IntegracaoESusDAO.prototype.listaAtividadeColetiva = async function (filtro) {
   let listaAtividadeColetiva = {};
   listaAtividadeColetiva.atendimentos = await this._connection.query(`SELECT * FROM vw_atividade_coletival_sus vw WHERE ${this.campoData} BETWEEN ? AND ?  AND idEstabelecimento = ? AND tipoFicha = ?`, [filtro.periodoExtracao[0], filtro.periodoExtracao[1], filtro.idEstabelecimento, 7]);
   listaAtividadeColetiva.paciente= await this._connection.query(`SELECT * FROM vw_cadastro_individual_sus vw WHERE (cpfCidadao IS NOT NULL OR cnsCidadao IS NOT NULL) and idEstabelecimentoCadastro = ? AND ${this.campoData} BETWEEN ? AND ? `, [filtro.idEstabelecimento, filtro.periodoExtracao[0], filtro.periodoExtracao[1]]);
   return listaAtividadeColetiva;
}

IntegracaoESusDAO.prototype.listaVacinas = async function (filtro) {
   let listaVacinas = {};
   listaVacinas.vacinas = await this._connection.query(`SELECT * FROM vw_vacina_sus WHERE dataUltimaDispensacao IS NOT NULL AND ${this.campoData} BETWEEN ? AND ?`, [filtro.periodoExtracao[0], filtro.periodoExtracao[1]]);
   listaVacinas.vacinaChild = await this._connection.query(`SELECT * FROM vw_vacina_child_sus`);
   return listaVacinas;
}

IntegracaoESusDAO.prototype.listaProcedimentos = async function (filtro) {
   let listaProcedimentos = {};
   listaProcedimentos.atendimentos = await this._connection.query(`SELECT * FROM vw_atendimento_individual_sus vw WHERE ${this.campoData} BETWEEN ? AND ? `, [filtro.periodoExtracao[0], filtro.periodoExtracao[1]]);
   listaProcedimentos.procedimentos = await this._connection.query(`SELECT tap.idAtendimento, tp.co_procedimento FROM tb_atendimento_procedimento tap
                                                                  INNER JOIN tb_procedimento tp ON (tap.idProcedimento = tp.id)`);
   return listaProcedimentos;
}

module.exports = function () {
   return IntegracaoESusDAO;
};