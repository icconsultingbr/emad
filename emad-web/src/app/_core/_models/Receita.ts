import { Input } from "@angular/core";

export class Receita {
    id: Number;
    @Input() idEstabelecimento: number;
    @Input() idMunicipio: number;
    @Input() idProfissional: number;
    @Input() idPaciente: number;
    @Input() idSubgrupoOrigem: number;
    @Input() ano: number;
    @Input() numero: number;
    @Input() dataEmissao: Date;
    @Input() dataUltimaDispensacao: Date;
    @Input() idMotivoFimReceita: number;
    @Input() idPacienteOrigem: number;
    @Input() idMandadoJudicial: number;
    @Input() situacao: Boolean;
}