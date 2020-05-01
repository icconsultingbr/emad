import { Input } from "@angular/core";

export class AtribuicaoCaneta {
    id: Number;
    @Input() idProfissional: Number;
    @Input() idCaneta: Number;
    @Input() periodoInicial: Date;
    @Input() periodoFinal: Date;
    @Input() situacao: Boolean;
}