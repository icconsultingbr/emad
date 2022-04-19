import { Input } from "@angular/core";

export class TipoExame {
    id: Number;
    @Input() nome: string;
    @Input() situacao: Boolean;
    @Input() idHipoteseDiagnostica: Number;
    @Input() nomeHipoteseDiagnostica: string;
    @Input() nomeProcedimento: string;
    @Input() idProcedimento: number;
    @Input() codSigTap: number;
    @Input() codAB: number;
}