import { Input } from '@angular/core';

export class Encaminhamento {
    id: Number = null;
    @Input() idPaciente: Number = null;
    @Input() idAtendimento: Number = null;
    @Input() idEspecialidade: Number = null;
    @Input() motivo: string = null;
}
