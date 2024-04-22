export type ObterAgendamentoPorIdDto = {
  idAgendamento?: number
  idPaciente?: number
  idEquipe?: number
  idProfissional?: number
  formaAtendimento?: number
  tipoAtendimento?: number
  dataInicial?: string
  dataFinal?: string
  observacao?: string
  nomeEquipe?: string
  profissionalNome?: string
  profissionalId?: number
  pacienteNome?: string
  especialidadeNome: string
  especialidadeId: number
}
