import { Injectable } from '@angular/core';
import { GenericsService } from '../../../_core/_services/generics.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class EstoqueUnidadeService extends GenericsService {

  constructor(public http: HttpClient) {
    super(http);
  }

  fields: any[] = [
    {
      field: 'id',
      type: 'hidden',
      label: 'Id',
      grid: false,
      form: true,
      required: false,
      validator: ['', '']
    }
  ];

  carregaEstoquePorEstabelecimento(tipoPesquisa: string, id: any, pesquisa: string): Observable<any> {
    return this.http.get('estoque/unidade/' + id + '/' + tipoPesquisa + pesquisa);
  }

  carregaEstoquePorEstabelecimentoDetalhado(idEstabelecimento: number, idMaterial: number): Observable<any> {
    return this.http.get('estoque/unidade/' + idEstabelecimento + '/material/' + idMaterial);
  }
}
