import { Input } from "@angular/core";

export class TipoNotificacao {
    id: Number;
    @Input() nome: string;
    @Input() situacao: Boolean;
}