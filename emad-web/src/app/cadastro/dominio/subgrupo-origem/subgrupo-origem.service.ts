import { Injectable } from '@angular/core';
import { GenericsService } from '../../../_core/_services/generics.service';
import { Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SubgrupoOrigemService extends GenericsService {

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
      field: 'idGrupoOrigem',
      type: 'select',
      label: 'Grupo de origem',
      grid: false,
      form: true,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: 'nomeGrupoOrigem',
      type: 'text',
      label: 'Grupo de origem',
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
      field: 'exibirCidade',
      type: 'checkbox',
      label: 'Exibir cidade',
      grid: true,
      form: true,
      translate: {1: 'Sim', 0: 'Não'},
      required: false,
      validator: ['', '']
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
