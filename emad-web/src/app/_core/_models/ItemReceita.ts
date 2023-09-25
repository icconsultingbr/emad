import { Input } from '@angular/core';
import { Estoque } from './Estoque';

export class ItemReceita {
    id: Number;
    @Input() idMaterial: number;
    @Input() idReceita: number;
    @Input() qtdPrescrita: number;
    @Input() tempoTratamento: number;
    @Input() qtdDispAnterior: number;
    @Input() qtdDispMes: number;
    @Input() qtdDispensar: number;
    @Input() dataUltDisp: Date;
    @Input() numReceitaControlada: string;
    @Input() idMotivoFimReceita: number;
    @Input() dataFimReceita: Date;
    @Input() observacao: string;
    @Input() idUsuarioFimReceita: number;
    @Input() situacao: number;
    @Input() nomeMaterial: string;
    @Input() itensEstoque: Estoque[] = [];
}
