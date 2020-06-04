import { Input } from "@angular/core";

export class SubGrupoMaterial {
    id: Number;
    @Input() idGrupoMaterial: number;
    @Input() nome: string;
    @Input() situacao: Boolean;
}