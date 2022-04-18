import { Input } from "@angular/core";

export class AtividadeColetiva {
    id: Number = null;
    @Input() idAtendimento: Number = null;
    @Input() idPaciente: Number = null;
    @Input() idAtividadeColetiva: Number = null;
    @Input() funcionalidade: string = 'ATENDIMENTO';
    @Input() idEstabelecimento: number = +JSON.parse(localStorage.getItem("est"))[0].id;
    
}