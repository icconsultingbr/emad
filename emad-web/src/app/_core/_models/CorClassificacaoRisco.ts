import { Input } from "@angular/core";

export class CorClassificacaoRisco {
    id: Number;
    @Input() nome: string;
    @Input() cor: number;
    @Input() situacao: Boolean;
}