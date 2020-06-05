import { Input } from "@angular/core";

export class FamiliaMaterial {
    id: Number;
    @Input() idGrupoMaterial: number;
    @Input() idSubGrupoMaterial: number;
    @Input() nome: string;
    @Input() situacao: Boolean;
}