import { Input } from '@angular/core';

export class IntegracaoEsusModel {
    @Input() periodoExtracao: Date[];
    @Input() idFichaEsus: string = null;
    @Input() idTipoPeriodo: string = null;
    @Input() idEstabelecimento: number = +JSON.parse(localStorage.getItem('est'))[0].id;
}

