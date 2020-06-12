import { Input } from "@angular/core";

export class ClassificacaoRisco {
    id: Number;
    @Input() nome: string;
    @Input() idCorClassificacaoRisco: number;
    @Input() situacao: Boolean;
}