import { Input } from "@angular/core";

export class EspecialidadeMaterial {
    id: Number;
    @Input() idEspecialidade: number;
    @Input() idMaterial: number;
    @Input() situacao: Boolean;
}