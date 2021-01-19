import { Input } from "@angular/core";

export class TipoExame {
    id: Number;
    @Input() nome: string;
    @Input() situacao: Boolean;
}