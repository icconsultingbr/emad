import { Input } from "@angular/core";

export class TipoMovimento {
    id: Number;
    @Input() nome: string;
    @Input() operacao: number;
    @Input() movimentoAdministrativo: boolean;
    @Input() loteBloqueado: number;
    @Input() loteVencido: number;
    @Input() situacao: Boolean;
}