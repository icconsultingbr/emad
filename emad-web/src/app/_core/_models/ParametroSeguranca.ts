import { Input } from "@angular/core";

export class ParametroSeguranca {
    id: Number;  
    @Input() nome: string;
    @Input() valor: string;
    @Input() situacao : Boolean;
    @Input() mascaraGrid : Boolean;
}