import { Input } from "@angular/core";

export class Atendimento {
    @Input() id: number = null;
    @Input() cpf: string = null;
    @Input() idPaciente: number = null;
    @Input() pacienteNome : string;
    @Input() pacienteHistoriaProgressa : string;    
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
    @Input() dataFinalizacao : string = null;
    @Input() dataCancelamento : string = null;
    @Input() idEstabelecimento : number = +JSON.parse(localStorage.getItem("est"))[0].id;
    @Input() idProfissional: number = null;
    @Input() ano_receita: number = null;
    @Input() numero_receita: number = null;
    @Input() unidade_receita: number = null;
    @Input() motivoQueixa : string = null;
    @Input() dadosFicha: any[] = [];
    @Input() tipoHistoriaClinica : number = null;    
}
