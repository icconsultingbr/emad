import { Input } from '@angular/core';
import { Guid } from 'guid-typescript';
import { ItemExame } from './ItemExame';

export class Exame {
    id: Number;
    @Input() idEstabelecimento: number = +JSON.parse(localStorage.getItem('est'))[0].id;
    @Input() nomeProfissional: string = JSON.parse(localStorage.getItem('currentUser'));
    @Input() idAtendimento: number;
    @Input() idPaciente: number;
    @Input() nomePaciente: string;
    @Input() situacao: string;
    @Input() idTipoExame: number;
    @Input() itensExame: ItemExame[] = [];
    @Input() acao: string;
    @Input() mensagemPaciente: string;
    @Input() ano: number;
    @Input() mes: string;
    @Input() numero: string;
    @Input() resultadoFinal: string;
}
