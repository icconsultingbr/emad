import { Injectable } from '@angular/core';
import { GenericsService } from '../../../_core/_services/generics.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class MedicamentoMovimentoService extends GenericsService {

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

  carregaMedicamentoMovimentacao(idTipoMovimento: string, params: any): Observable<any> {
    return this.http.get('material/movimentacao/' + idTipoMovimento + '/filtros'  + params);
  }

  carregaTipoMovimentoPorOperacao(id: any): Observable<any> {
    return this.http.get('tipo-movimento/operacao/' + id);
}
}
