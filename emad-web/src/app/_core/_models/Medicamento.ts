import { Input } from "@angular/core";

export class Medicamento {
    id: Number;  
    @Input() nome: string;
    @Input() situacao : Boolean;
}