import { Injectable } from '@angular/core';
import { GenericsService } from '../../_core/_services/generics.service';
import { Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CanetaService extends GenericsService {

  constructor(public http: HttpClient) {
    super(http);
  }

  fields: any[] = [
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
      field: 'idModeloCaneta',
      type: 'select',
      label: 'Modelo',
      grid: false,
      form: true,
      required: true,
      validator: ['',  Validators.required],
    },
    {
      field: 'nomeModeloCaneta',
      type: 'text',
      label: 'Modelo',
      grid: true,
      form: false,
      required: true,
      validator: ['', ''],
    },
    {
      field: 'serialNumber',
      type: 'text',
      label: 'Serial number',
      grid: true,
      form: true,
      required: true,
      validator: ['', Validators.required],
    },
    {
      field: 'idEstabelecimento',
      type: 'hidden',
      label: 'Estabelecimento',
      grid: false,
      form: true,
      required: true,
      readonly: true,
      validator: ['', ''],
      filter: {
          type: 'select',
          grid: true
      }
  },
    {
      field: 'nomeFantasia',
      type: 'text',
      label: 'Nome do estabelecimento',
      grid: true,
      form: false,
      required: true,
      validator: ['', ''],
    },
    {
      field: 'situacao',
      type: 'checkbox',
      label: 'Situação',
      translate: {'1' : 'Ativo' , '0' : 'Inativo'},
      grid: true,
      form: true,
      required: true,
      validator: ['', Validators.required]
    }
  ];
}
