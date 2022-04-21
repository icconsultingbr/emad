import { Input } from "@angular/core";
import * as moment from 'moment';

export class ProfissionalAtividadeColetiva {
    @Input() idProfissional: Number = null;
    @Input() idAtendimento: Number = null;
}