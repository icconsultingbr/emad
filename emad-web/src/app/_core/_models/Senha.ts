import { Input } from "@angular/core";

export class Senha {
  
    @Input() nome: string;
    @Input() cpf: string;
    @Input() senhaAtual : string;
    @Input() novaSenha : string;
    @Input() confirmarNovaSenha : string;
    @Input() id: number;
}