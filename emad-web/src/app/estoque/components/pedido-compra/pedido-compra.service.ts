import { Injectable } from '@angular/core';
import { GenericsService } from '../../../_core/_services/generics.service';
import { Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PedidoCompraService extends GenericsService {

  constructor(public http: HttpClient) {
    super(http);
  }

  public fields: any[] = [
    {
      field: 'id',
      type: 'hidden',
      label: 'Id',
      grid: true,
      form: true,
      required: false,
      validator: ['', '']
    },
    {
      field: 'numeroPedido',
      type: 'text',
      label: 'Número',
      grid: true,
      form: true,
      required: false,
      validator: ['', '']
    },
    {
      field: 'numeroEmpenho',
      type: 'text',
      label: 'Empenho',
      grid: true,
      form: true,
      required: false,
      validator: ['', '']
    },
    {
      field: 'dataPedido',
      type: 'text',
      label: 'Data pedido',
      grid: true,
      form: false,
      isDate: true,
      required: false,
      validator: ['', ''],
      filter: {
        type: 'date',
        placeHolder: '99/99/9999',
        grid: true
      },
    },
    {
      field: 'dataEmpenho',
      type: 'hidden',
      label: 'Data empenho',
      grid: true,
      form: false,
      isDate: true,
      required: false,
      validator: ['', ''],
      filter: {
        type: 'date',
        placeHolder: '99/99/9999',
        grid: true
      },
    },
    {
      field: 'status',
      type: 'text',
      label: 'Status',
      grid: true,
      form: true,
      required: true,
      translate: {'A': 'ATIVO', 'F': 'FINALIZADO'},
      validator: ['', Validators.required]
    },
    {
      field: 'situacao',
      type: 'checkbox',
      label: 'Situação',
      grid: false,
      form: false,
      translate: {1: 'Ativo', 0: 'Inativo'},
      required: true,
      validator: ['', Validators.required]
    }
  ];

  inserir(obj: any) {
    if (obj.id) {
        return this.http
            .put('pedido-compra', JSON.stringify(obj));
    } else {
        return this.http
            .post('pedido-compra', JSON.stringify(obj));
    }
  }
}
