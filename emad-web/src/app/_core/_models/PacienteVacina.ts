import { Input } from "@angular/core";
import * as moment from 'moment';


export class PacienteVacina {
    id: Number = null;
    @Input() nome: string;
    @Input() validade: string;
    @Input() lote: string;
    @Input() nomeProfissional: string = JSON.parse(localStorage.getItem("currentUser")).nome;
    @Input() idAtendimento: Number = null;
    @Input() idPaciente: Number = null;
    @Input() dataCriacao: Date = null;
}