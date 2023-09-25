import { Input } from '@angular/core';

export class PacienteProcedimento {
    id: Number = null;
    @Input() idAtendimento: Number = null;
    @Input() idPaciente: Number = null;
    @Input() idProcedimento: Number = null;
    @Input() qtd: Number = null;
    @Input() funcionalidade = 'ATENDIMENTO';
}
