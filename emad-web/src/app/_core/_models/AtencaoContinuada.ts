import { Input } from '@angular/core';

export class AtencaoContinuada {
    id: Number;
    @Input() nome: string;
    @Input() situacao: Boolean;
}
