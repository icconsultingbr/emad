import { Input } from "@angular/core";

export class RecuperarSenha {
  
    @Input() novaSenha : string;
    @Input() confirmarNovaSenha : string;
}