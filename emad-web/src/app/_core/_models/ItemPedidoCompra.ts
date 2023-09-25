import { Input } from '@angular/core';

export class ItemPedidoCompra {
    id: Number;
    @Input() idPedidoCompra: number;
    @Input() idMaterial: number;
    @Input() nomeMaterial: string;
    @Input() codigoMaterial: string;
    @Input() qtdCompra: number;
    @Input() saldoEntregue: number;
    @Input() dataPrevistaEntrega: Date;
    @Input() dataUltimaEntrega: Date;
    @Input() situacao: Boolean;
    @Input() idFront: string;
}
