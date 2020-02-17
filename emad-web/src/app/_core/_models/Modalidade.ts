import { Input } from "@angular/core";

export class Modalidade {
    id: Number;  
    @Input() nome: String;
    @Input() situacao : Boolean;
}