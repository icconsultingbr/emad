import { Input } from "@angular/core";

export class AtendimentoMedicamento {
    id: Number = null;
    @Input() idPaciente: Number = null;
    @Input() idMedicamento: Number = null;
    @Input() uso: String = null;
    @Input() tipoVia: String = null;
    @Input() quantidade: String = null;
    @Input() apresentacao: String = null;
    @Input() posologia: String = null;
    @Input() idAtendimento: Number = null;  
}








