import { Input } from '@angular/core';

export class OrientacaoSexual {
    id: Number;
    @Input() nome: string;
    @Input() situacao: Boolean;
}
