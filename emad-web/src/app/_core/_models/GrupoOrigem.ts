import { Input } from "@angular/core";

export class GrupoOrigem {
    id: Number;
    @Input() nome: string;
    @Input() situacao: Boolean;
}