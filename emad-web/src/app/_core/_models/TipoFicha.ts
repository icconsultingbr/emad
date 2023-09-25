import { Input } from '@angular/core';

export class TipoFicha {
    id: Number;
    @Input() nome: string;
    @Input() xmlTemplate: string;
    @Input() queryTemplate: string;
    @Input() situacao: Boolean;
    @Input() versaoSistema: string;
    @Input() uuidInstalacao: string;
    @Input() major: string;
    @Input() minor: string;
    @Input() revision: string;
}
