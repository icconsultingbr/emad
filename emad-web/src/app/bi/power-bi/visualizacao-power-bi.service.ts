import { Injectable } from '@angular/core';
import { GenericsService } from '../../_core/_services/generics.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class VisualizacaoPowerBiService extends GenericsService {

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

  buscaPorChaveId(chave: string): Observable<any> {
    return this.http.get('parametro-seguranca/busca-chave/' + chave);
  }
}
