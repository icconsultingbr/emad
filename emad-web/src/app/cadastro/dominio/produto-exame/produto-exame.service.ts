import { Injectable } from '@angular/core';
import { GenericsService } from '../../../_core/_services/generics.service';
import { Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ProdutoExameService extends GenericsService {

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
      field: 'idTipoExame',
      type: 'select',
      label: 'Tipo de exame',
      grid: false,
      form: true,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: 'nomeTipoExame',
      type: 'text',
      label: 'Tipo de exame',
      grid: true,
      form: false,
      required: false,
      validator: ['', '']
    },
    {
      field: 'nome',
      type: 'text',
      label: 'Nome',
      grid: true,
      form: true,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: 'situacao',
      type: 'checkbox',
      label: 'Situação',
      grid: true,
      form: true,
      translate: {1: 'Ativo', 0: 'Inativo'},
      required: true,
      validator: ['', Validators.required]
    }
  ];
}
