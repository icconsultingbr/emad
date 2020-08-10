import { Input } from "@angular/core";

export class ItemSolicitacaoRemanejamento {
    id: Number;
    @Input() idSolicitacaoRemanejamento: number;
    @Input() idMaterial: number;
    @Input() nomeMaterial: string;
    @Input() codigoMaterial: string;    
    @Input() qtdSolicitada: number;
    @Input() qtdAtendida: number;
    @Input() situacao: Boolean;
    @Input() idFront: string;
}