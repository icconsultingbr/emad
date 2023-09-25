import { Injectable } from '@angular/core';
import { GenericsService } from '../../_core/_services/generics.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class LogService extends GenericsService {

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
      field: 'idEstabelecimento',
      type: 'select',
      label: 'Estabelecimento',
      grid: true,
      form: false,
      required: false,
      validator: ['', ''],
      filter: {
        type: 'select',
        grid : true
      }
    },
    {
      field: 'dataCriacao',
      type: 'text',
      label: 'Data',
      grid: true,
      form: false,
      required: false,
      isDateTime: true
    },
    {
      field: 'funcionalidade',
      type: 'text',
      label: 'Funcionalidade',
      grid: true,
      form: false,
      required: false,
      translate: true
    },
    {
      field: 'acao',
      type: 'text',
      label: 'Ação',
      grid: true,
      form: false,
      required: false,
      translate: true
    },
    {
      field: 'idUsuario',
      type: 'text',
      label: 'Usuário',
      grid: true,
      form: false,
      required: false,

    },
    {
      field: 'entrada',
      type: 'text',
      label: 'Dados de entrada',
      grid: true,
      form: false,
      required: false,
    }
  ];
}
