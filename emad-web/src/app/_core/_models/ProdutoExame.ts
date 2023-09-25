import { Input } from '@angular/core';

export class ProdutoExame {
    id: Number;
    @Input() tipoExameId: number;
    @Input() nome: string;
    @Input() situacao: Boolean;
}
