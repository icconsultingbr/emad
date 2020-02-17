import { Input } from "@angular/core";

export class Senha {
  
    @Input() senhaAtual : String;
    @Input() novaSenha : String;
    @Input() confirmarNovaSenha : String;
}