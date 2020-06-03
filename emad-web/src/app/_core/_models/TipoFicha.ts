import { Input } from "@angular/core";

export class TipoFicha {
    id: Number;
    @Input() nome: string;
    @Input() xmlTemplate: string;
    @Input() queryTemplate: string;
    @Input() situacao: Boolean;
}