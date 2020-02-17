import { Input } from "@angular/core";

export class HipoteseDiagnostica {
    id: Number;  
    @Input() nome: String;
    @Input() situacao : Boolean;
}