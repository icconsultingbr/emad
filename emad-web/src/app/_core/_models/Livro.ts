import { Input } from '@angular/core';

export class Livro {
    id: Number;
    @Input() nome: string;
    @Input() situacao: Boolean;
}
