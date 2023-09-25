import { Injectable } from '@angular/core';
import { GenericsService } from '../../_core/_services/generics.service';
import { Observable } from 'rxjs';
import { Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AtribuicaoCanetaService extends GenericsService {

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
      field: 'idCaneta',
      type: 'select',
      label: 'Caneta',
      grid: false,
      form: false,
      required: false,
      validator: ['', ''],
      filter: {
        type: 'select'
      }
    },
    {
      field: 'nomeCaneta',
      type: 'text',
      label: 'Caneta',
      grid: true,
      form: false,
      required: true,
      validator: ['', ''],
    },
    {
      field: 'idProfissional',
      type: 'select',
      label: 'Profissional',
      grid: false,
      form: false,
      required: false,
      validator: ['', ''],
      filter: {
        type: 'select'
      }
    },
    {
      field: 'nomeProfissional',
      type: 'text',
      label: 'Nome do profissional',
      grid: true,
      form: false,
      required: false,
      validator: ['', ''],
    },
    {
      field: 'periodoInicial',
      type: 'text',
      label: 'Data de atribuição inicial',
      grid: true,
      form: false,
      required: false,
      validator: ['', ''],
      filter: {
        type: 'date',
        placeHolder: '99/99/9999'
      }
    },
    {
      field: 'periodoFinal',
      type: 'text',
      label: 'Data de atribuição final',
      grid: true,
      form: false,
      required: false,
      validator: ['', ''],
    },
    {
      field: 'situacao',
      type: 'text',
      label: 'Situação',
      grid: true,
      form: true,
      required: true,
      validator: ['', Validators.required]
    }
  ];

  findHistoricoAtribuicaoByProfissional(id: any, dateInicial: string, horaInicial: string, dateFinal: string, horaFinal: string): Observable<any> {
    return this.http.get('atribuicao-caneta/profissional/' + id
      + '?dataInicial=' + dateInicial
      + '&horaInicial=' + horaInicial
      + '&dataFinal=' + dateFinal
      + '&horaFinal=' + horaFinal);
  }

  saveAtribuicao(obj: any) {
    if (obj.id) {
      return this.http
        .put('atribuicao-caneta', JSON.stringify(obj));
    } else {
      return this.http
        .post('atribuicao-caneta', JSON.stringify(obj));
    }
  }

  removeAtribuicao(params: any) {
    return this.http.delete('atribuicao-caneta/' + params);
  }
}
