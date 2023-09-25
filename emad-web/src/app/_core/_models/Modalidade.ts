import { Input } from '@angular/core';

export class Modalidade {
    id: Number;
    @Input() nome: string;
    @Input() situacao: Boolean;
}
