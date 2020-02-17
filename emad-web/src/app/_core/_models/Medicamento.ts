import { Input } from "@angular/core";

export class Medicamento {
    id: Number;  
    @Input() nome: String;
    @Input() situacao : Boolean;
}