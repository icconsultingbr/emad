import { Input } from "@angular/core";

export class TipoUsuario{
    id:Number;
    @Input() nome: string;
    @Input() periodoSenha : string;
    @Input() bloqueioTentativas : string;

    
}