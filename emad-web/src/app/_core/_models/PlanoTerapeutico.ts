import { Input } from "@angular/core";

export class PlanoTerapeutico {
    id: Number = null;
    @Input() idPaciente : Number = null;
    @Input() pacienteNome : String = null;
    @Input() equipe : String = null;
    @Input() idEquipe : Number = null;
    @Input() idProfissional : Number = null;
    @Input() idTipoAgenda : String = null;
    @Input() dataInicio : String = null;
    @Input() dataFim : String = null;
    @Input() dataVigencia : String = null;
    @Input() daysFlag : String = null;
    @Input() observacoes : String = null;
}