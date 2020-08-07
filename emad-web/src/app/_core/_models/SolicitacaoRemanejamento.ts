import { Input } from "@angular/core";

export class SolicitacaoRemanejamento {
    id: Number;
    @Input() idEstabelecimentoSolicitada: number;
    @Input() idEstabelecimentoSolicitante: number = +JSON.parse(localStorage.getItem("est"))[0].id;;
    @Input() situacao: number;
    @Input() idEstabelecimento: number = +JSON.parse(localStorage.getItem("est"))[0].id;
}