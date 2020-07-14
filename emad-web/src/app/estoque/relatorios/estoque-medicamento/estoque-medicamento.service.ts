import { Injectable } from '@angular/core';
import { GenericsService } from '../../../_core/_services/generics.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class EstoqueMedicamentoService extends GenericsService {

  constructor(public http: HttpClient) {
    super(http);
  }

  fields: any[] = [
    {
      field: "id",
      type: "hidden",
      label: "Id",
      grid: false,
      form: true,
      required: false,
      validator: ['', '']
    }
  ];

  carregaEstoquePorMedicamento(tipoPesquisa: string, id: any): Observable<any> {    
    return this.http.get("estoque/material/" + id + "/tipo-pesquisa/" + tipoPesquisa);
  }
  
  carregaEstoquePorEstabelecimentoDetalhado(idEstabelecimento: number, idMaterial: number): Observable<any> {
    return this.http.get("estoque/unidade/" + idEstabelecimento + "/material/" + idMaterial);
  }
}
