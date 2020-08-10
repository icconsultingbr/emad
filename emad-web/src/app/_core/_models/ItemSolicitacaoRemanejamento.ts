import { Input } from "@angular/core";
import { Estoque } from "./Estoque";

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
    @Input() itensEstoque: Estoque[] = [];  
}