import { Input } from "@angular/core";

export class AgendaProfissional {
    id: Number = null;
    @Input() pacienteNome : String = null;
    @Input() nome : String = null;
    @Input() idPaciente : Number = null;
    @Input() equipe : String = null;
    @Input() equipeNome : String = null;
    @Input() idEquipe : Number = null;
    @Input() idProfissional : Number = null;
    @Input() idTipoAgenda : String = null;
    @Input() dataInicio : String = null;
    @Input() horaInicio : String = null;
    @Input() horaFim : String = null;
    @Input() dataVigencia : String = null;
    @Input() daysFlag : String = null;
    @Input() observacoes : Number = null;
    @Input() dom : Boolean = false;
    @Input() seg : Boolean = false;
    @Input() ter : Boolean = false;
    @Input() qua : Boolean = false;
    @Input() qui : Boolean = false;
    @Input() sex : Boolean = false;
    @Input() sab : Boolean = false;
    @Input() idEstabelecimento : Number = +JSON.parse(localStorage.getItem("est"))[0].id;

}