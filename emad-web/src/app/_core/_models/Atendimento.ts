import { Input } from '@angular/core';

export class Atendimento {
  @Input() id: number = null;
  @Input() cpf: string = null;
  @Input() idPaciente: number = null;
  @Input() pacienteNome: string;
  @Input() pacienteHistoriaProgressa: string;
  @Input() pressaoArterial: string = null;
  @Input() pulso: string = null;
  @Input() saturacao: string = null;
  @Input() temperatura: string = null;
  @Input() altura: string = null;
  @Input() peso: string = null;
  @Input() historicoClinico: string = null;
  @Input() historiaProgressa: string = null;
  @Input() exameFisico: string = null;
  @Input() observacoesGerais: string = null;
  @Input() situacao: string = null;
  @Input() motivoCancelamento: string = null;
  @Input() dataCriacao: Date = new Date();
  @Input() dataFinalizacao: string = null;
  @Input() dataCancelamento: string = null;
  @Input() idEstabelecimento: number = +JSON.parse(
    localStorage.getItem('est'),
  )[0].id;
  @Input() idProfissional: number = null;
  @Input() ano_receita: number = null;
  @Input() numero_receita: number = null;
  @Input() unidade_receita: number = null;
  @Input() motivoQueixa: string = null;
  @Input() dadosFicha: any[] = [];
  @Input() tipoHistoriaClinica: number = null;
  @Input() pesquisaCentral: string = null;
  @Input() idTipoAtendimentoHistorico: number = null;
  @Input() ficouEmObservacao: number = null;
  @Input() tiposConsultaOdonto: number = null;
  @Input() tiposFornecimOdonto: number = null;
  @Input() tiposVigilanciaSaudeBucal: number = null;

  @Input() inep: string;
  @Input() numParticipantes: number;
  @Input() profissionais: number;
  @Input() atividadeTipo: number;
  @Input() temasParaReuniao: number;
  @Input() publicoAlvo: number;
  @Input() participantes: number;
  @Input() procedimento: number;
  @Input() temasParaSaude: number;
  @Input() praticasEmSaude: number;
  @Input() pseEducacao: boolean;
  @Input() pseSaude: boolean;

  @Input() gestante: number;
  @Input() possuiNecessidadesEspeciais: number;
  @Input() tipoConsultaOdonto: number;

  @Input() condutaEncaminhamento: number;

  @Input() localDeAtendimento: number;
  @Input() modalidade: number;
  @Input() tipoAtendimento: number;
  @Input() vacinasEmDia: number;
  @Input() condicaoAvaliada: number;
  @Input() idProfissionalCompartilhado: number;
  @Input() integracaoPEC: boolean;
}

export class AtendimentoHistorico {
  @Input() id: number = null;
  @Input() idAtendimento: number = null;
  @Input() idTipoAtendimentoHistorico: number = null;
  @Input() cpf: string = null;
  @Input() idPaciente: number = null;
  @Input() pacienteNome: string;
  @Input() pacienteHistoriaProgressa: string;
  @Input() pressaoArterial: string = null;
  @Input() pulso: string = null;
  @Input() saturacao: string = null;
  @Input() temperatura: string = null;
  @Input() altura: string = null;
  @Input() peso: string = null;
  @Input() historicoClinico: string = null;
  @Input() historiaProgressa: string = null;
  @Input() exameFisico: string = null;
  @Input() observacoesGerais: string = null;
  @Input() situacao: string = null;
  @Input() motivoCancelamento: string = null;
  @Input() dataFinalizacao: string = null;
  @Input() dataCancelamento: string = null;
  @Input() idEstabelecimento: number = +JSON.parse(
    localStorage.getItem('est'),
  )[0].id;
  @Input() idProfissional: number = null;
  @Input() ano_receita: number = null;
  @Input() numero_receita: number = null;
  @Input() unidade_receita: number = null;
  @Input() motivoQueixa: string = null;
  @Input() dadosFicha: any[] = [];
  @Input() tipoHistoriaClinica: number = null;
  @Input() textoHistorico: string = null;
  @Input() ficouEmObservacao: number = null;
  @Input() inep: string;
  @Input() numParticipantes: number;
  @Input() profissionais: number;
  @Input() atividadeTipo: number;
  @Input() temasParaReuniao: number;
  @Input() publicoAlvo: number;
  @Input() participantes: number;
  @Input() procedimentoSIGTAP: number;
  @Input() temasParaSaude: number;
  @Input() praticasEmSaude: number;
  @Input() pseEducacao: boolean;
  @Input() pseSaude: boolean;

  @Input() gestante: number;
  @Input() possuiNecessidadesEspeciais: number;
  @Input() tipoConsultaOdonto: number;

  @Input() condutaEncaminhamento: number;

  @Input() localDeAtendimento: number;
  @Input() modalidade: number;
  @Input() tipoAtendimento: number;
  @Input() vacinasEmDia: number;
  @Input() condicaoAvaliada: number;
  @Input() idProfissionalCompartilhado: number;
  @Input() integracaoPEC: boolean;
}

export class AtendimentoFiltro {
  @Input() cartaoSus: string;
  @Input() cpf: string;
  @Input() nomePaciente: string;
  @Input() dataCriacaoInicial: Date;
  @Input() dataCriacaoFinal: Date;
  @Input() situacao: string;
  @Input() idSap: string;
  @Input() pesquisaCentral: string;
  @Input() idEstabelecimento: number = +JSON.parse(
    localStorage.getItem('est'),
  )[0].id;
}
