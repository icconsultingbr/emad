import { Input } from '@angular/core';
import * as moment from 'moment';

export class ParticipanteAtividadeColetiva {
    @Input() id: Number = null;
    @Input() idPaciente: Number = null;
    @Input() idAtendimento: Number = null;
    @Input() nomePaciente: string = null;
    @Input() cartaoSus: string = null;
    @Input() dataNascimento: string = null;
    @Input() sexo: number = null;
    @Input() parouFumar: boolean = null;
    @Input() abandonouGrupo: boolean = null;
    @Input() avaliacaoAlterada: boolean = null;
    @Input() peso: string = null;
    @Input() altura: string = null;
}
