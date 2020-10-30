import { Input } from "@angular/core";

export class HipoteseDiagnostica {
    id: Number;  
    @Input() nome: string;
    @Input() situacao : Boolean;
    @Input() cid_10: string;
}