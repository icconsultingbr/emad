import { Input } from '@angular/core';

export class EspecialidadeEntidadeCampo {
    id: Number;
    @Input() idEspecialidade: number;
    @Input() idEntidadeCampo: number;
    @Input() situacao: Boolean;
}
