import { Input } from "@angular/core";

export class RecuperarSenha {
  
    @Input() novaSenha : String;
    @Input() confirmarNovaSenha : String;
}