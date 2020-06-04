import { Input } from "@angular/core";

export class FabricanteMaterial {
    id: Number;
    @Input() fabricante: string;
    @Input() situacao: Boolean;
}