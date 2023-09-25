import { Input } from '@angular/core';

export class PacienteCondicaoAvaliada {
    id: Number = null;
    @Input() idAtendimento: Number = null;
    @Input() idPaciente: Number = null;
    @Input() idCondicaoAvaliada: Number = null;
}
