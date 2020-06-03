import { Input } from "@angular/core";

export class TipoUnidade {
    id: Number;
    @Input() nome: String;
    @Input() situacao : Boolean;
}