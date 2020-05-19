import { Input } from "@angular/core";

export class ParametroSeguranca {
    id: Number;  
    @Input() nome: String;
    @Input() valor: String;
    @Input() situacao : Boolean;
    @Input() mascaraGrid : Boolean;
}