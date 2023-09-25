import { Input } from '@angular/core';
import * as moment from 'moment';

export class tiposFornecimOdonto {
    @Input() id: Number = null;
    @Input() idPaciente: Number = null;
    @Input() idAtendimento: Number = null;
    @Input() nome: string = null;
    @Input() idFornecimento: Number = null;

}
