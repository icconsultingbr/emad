import { Input } from '@angular/core';

export class CondicaoAvaliada {
    id: number;
    @Input() ciap2: string;
    @Input() descricaoAB: string;
    @Input() codigoAB: string;
    @Input() sexo: string;
}


