import { Injectable } from '@angular/core';
import { GenericsService } from '../../../_core/_services/generics.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AlteraValidadeService extends GenericsService {

  constructor(public http: HttpClient) {
    super(http);
  }

  public fields: any[] = [
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

  alterarValidade(obj: any) {
    return this.http.put('estoque/alterar-validade-lote', JSON.stringify(obj));
  }
}
