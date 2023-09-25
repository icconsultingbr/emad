import { Input } from '@angular/core';

export class FabricanteMaterial {
    id: Number;
    @Input() nome: string;
    @Input() situacao: Boolean;
}
