import { Input } from "@angular/core";

export class AgendaProfissional {
    id: Number = null;
    @Input() pacienteNome : string = null;
    @Input() nome : string = null;
    @Input() idPaciente : Number = null;
    @Input() equipe : string = null;
    @Input() equipeNome : string = null;
    @Input() idEquipe : Number = null;
    @Input() idProfissional : Number = null;
    @Input() idTipoAgenda : string = null;
    @Input() dataInicio : string = null;
    @Input() horaInicio : string = null;
    @Input() horaFim : string = null;
    @Input() dataVigencia : string = null;
    @Input() daysFlag : string = null;
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