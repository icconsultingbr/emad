import { Input } from '@angular/core';

export class Genero {
    id: Number;
    @Input() nome: string;
    @Input() situacao: Boolean;
}
