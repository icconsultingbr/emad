import { Input } from '@angular/core';
import { ItemPedidoCompra } from './ItemPedidoCompra';

export class PedidoCompra {
    id: Number;
    @Input() numeroPedido: string;
    @Input() numeroEmpenho: string;
    @Input() dataPedido: Date;
    @Input() dataEmpenho: Date;
    @Input() status: string;
    @Input() situacao: Boolean;
    @Input() itensPedidoCompra: ItemPedidoCompra[] = [];
    @Input() itensPedidoCompraExcluidos: ItemPedidoCompra[] = [];
}

