import { Input } from "@angular/core";

export class TipoUsuario{
    id:Number;
    @Input() nome: string;
    @Input() periodoSenha : String;
    @Input() bloqueioTentativas : String;

    
}