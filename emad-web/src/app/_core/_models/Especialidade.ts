import { Input } from '@angular/core';

export class Especialidade {
    id: Number;
    @Input() nome: string;
    @Input() situacao: Boolean;
    @Input() codigoCBO: Boolean;
}
