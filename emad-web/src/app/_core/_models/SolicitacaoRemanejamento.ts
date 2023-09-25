import { Input } from '@angular/core';
import { ItemSolicitacaoRemanejamento } from './ItemSolicitacaoRemanejamento';

export class SolicitacaoRemanejamento {
    id: Number;
    @Input() idEstabelecimentoSolicitada: number;
    @Input() idEstabelecimentoSolicitante: number = +JSON.parse(localStorage.getItem('est'))[0].id;
    @Input() nomeEstabelecimentoSolicitante: string = JSON.parse(localStorage.getItem('est'))[0].nomeFantasia;
    @Input() situacao: number;
    @Input() idEstabelecimento: number = +JSON.parse(localStorage.getItem('est'))[0].id;
    @Input() itensSolicitacaoRemanejamento: ItemSolicitacaoRemanejamento[] = [];
    @Input() idTipoMovimento: number;
}
