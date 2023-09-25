import { Input } from '@angular/core';

export class ComorbidadeEstabelecimento {
    @Input() idEstabelecimento: number = +JSON.parse(localStorage.getItem('est'))[0].id;
    @Input() nomeEstabelecimento: string = JSON.parse(localStorage.getItem('est'))[0].nomeFantasia;
}
