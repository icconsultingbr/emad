import { Input } from '@angular/core';

export class MetodoExame {
    id: Number;
    @Input() nome: string;
    @Input() situacao: Boolean;
}
