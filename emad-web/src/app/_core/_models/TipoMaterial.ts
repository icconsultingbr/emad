import { Input } from "@angular/core";

export class TipoMaterial {
    id: Number;
    @Input() nome: string;
    @Input() situacao: Boolean;
}