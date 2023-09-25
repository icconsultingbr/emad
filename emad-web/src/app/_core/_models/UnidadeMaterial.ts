import { Input } from '@angular/core';

export class UnidadeMaterial {
    id: Number;
    @Input() nome: string;
    @Input() descricao: string;
    @Input() situacao: Boolean;
}
