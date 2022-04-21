import { Input } from "@angular/core";
import * as moment from 'moment';

export class ParticipanteAtividadeColetiva {
    @Input() idPaciente: Number = null;
    @Input() idAtendimento: Number = null;
    @Input() nomePaciente: string = null;
    @Input() cartaoSus: string = null;
    @Input() dataNascimento: string = null;
    @Input() sexo: number = null;
    @Input() parouFumar: boolean = null;
    @Input() abandonouGrupo: boolean = null;
    @Input() avaliacaoAlterada: boolean = null;
}