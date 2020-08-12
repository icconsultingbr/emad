import { Injectable } from '@angular/core';
import { GenericsService } from '../../../_core/_services/generics.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class PacienteMedicamentoService extends GenericsService {

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

  carregaPacientePorMedicamento(params: any): Observable<any> {    
    return this.http.get("paciente/material/filtros" + params);
  }
}
