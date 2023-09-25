import { Input } from '@angular/core';

export class MotivoFimReceita {
    id: Number;
    @Input() nome: string;
    @Input() situacao: Boolean;
}
