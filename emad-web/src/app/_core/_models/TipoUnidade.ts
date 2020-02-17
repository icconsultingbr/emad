import { Input } from "@angular/core";

export class TipoUnidade{
    id:Number;
    @Input() nome: string;
    @Input() situacao: Boolean;
}