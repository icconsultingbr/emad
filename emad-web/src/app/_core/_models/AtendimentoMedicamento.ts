import { Input } from '@angular/core';

export class AtendimentoMedicamento {
    id: Number = null;
    @Input() idPaciente: Number = null;
    @Input() idMaterial: Number = null;
    @Input() uso: string = null;
    @Input() idTipoViaMaterial: Number = null;
    @Input() quantidade: string = null;
    @Input() apresentacao: string = null;
    @Input() posologia: string = null;
    @Input() idAtendimento: Number = null;
}








