import { Input } from "@angular/core";

export class Especialidade {
    id: Number;  
    @Input() nome: String;
    @Input() situacao : Boolean;
}