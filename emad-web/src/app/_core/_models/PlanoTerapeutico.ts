import { Input } from '@angular/core';

export class PlanoTerapeutico {
    id: Number = null;
    @Input() idPaciente: Number = null;
    @Input() pacienteNome: string = null;
    @Input() equipe: string = null;
    @Input() idEquipe: Number = null;
    @Input() idProfissional: Number = null;
    @Input() idTipoAgenda: string = null;
    @Input() dataInicio: string = null;
    @Input() dataFim: string = null;
    @Input() dataVigencia: string = null;
    @Input() daysFlag: string = null;
    @Input() observacoes: string = null;
}
