import { Input } from '@angular/core';
import * as moment from 'moment';

export class VigilanciaSaudeBucal {
    @Input() id: Number = null;
    @Input() idPaciente: Number = null;
    @Input() idAtendimento: Number = null;
    @Input() nome: string = null;
    @Input() idVigilancia: Number = null;

}
