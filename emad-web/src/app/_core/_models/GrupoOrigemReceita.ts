import { Input } from "@angular/core";

export class GrupoOrigemReceita {
    id: Number;
    @Input() nome: string;
    @Input() situacao: Boolean;
}