import { Input } from "@angular/core";

export class TipoFicha {
    id: Number;  
    @Input() nome: String;
    @Input() situacao : Boolean;
}