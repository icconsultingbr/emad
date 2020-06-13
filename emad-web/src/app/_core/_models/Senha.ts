import { Input } from "@angular/core";

export class Senha {
  
    @Input() senhaAtual : string;
    @Input() novaSenha : string;
    @Input() confirmarNovaSenha : string;
}