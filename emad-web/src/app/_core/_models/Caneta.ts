import { Input } from '@angular/core';

export class Caneta {
    id: Number;
    @Input() modelo: string;
    @Input() serial: string;
    @Input() situacao: Boolean;
    @Input() idEstabelecimento: Number = +JSON.parse(localStorage.getItem('est'))[0].id;
}
