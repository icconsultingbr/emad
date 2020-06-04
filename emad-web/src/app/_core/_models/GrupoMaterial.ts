import { Input } from "@angular/core";

export class GrupoMaterial {
    id: Number;
    @Input() nome: string;
    @Input() tipoObrigatorio: boolean;
    @Input() situacao: Boolean;
}