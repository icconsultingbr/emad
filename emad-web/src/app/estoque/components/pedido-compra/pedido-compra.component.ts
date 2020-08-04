import { Component, OnInit } from '@angular/core';
import { AppNavbarService } from '../../../_core/_components/app-navbar/app-navbar.service';
import { PedidoCompraService } from './pedido-compra.service';
import { PedidoCompra } from '../../../_core/_models/PedidoCompra';

@Component({
    selector: 'app-pedido-compra',
    templateUrl: './pedido-compra.component.html',
    styleUrls: ['./pedido-compra.component.css'],
    providers: [PedidoCompraService]
})

export class PedidoCompraComponent implements OnInit {

  method: String = "pedido-compra";
  object: PedidoCompra = new PedidoCompra();
  fields: any[] = [];
  fieldsSearch: any[] = [];

  constructor(
    public nav: AppNavbarService,
    private service: PedidoCompraService) {
    for (let field of this.service.fields) {
      if (field.grid) {
        this.fields.push(field);
      }
      if (field.filter) {
        this.fieldsSearch.push(field);
      }
    }
  }

  ngOnInit() {
    this.nav.show();
  }
}