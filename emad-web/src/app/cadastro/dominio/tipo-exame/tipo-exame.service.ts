import { Injectable } from '@angular/core';
import { GenericsService } from '../../../_core/_services/generics.service';
import { Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoExame } from '../../../_core/_models/TipoExame';

@Injectable()
export class TipoExameService extends GenericsService {

  constructor(public http: HttpClient) {
    super(http);
  }

  public fields: any[] = [    
    {
      field: "id",
      type: "hidden",
      label: "Id",
      grid: true,
      form: true,
      required: false,
      validator: ['', '']
    },
    {
      field: "nome",
      type: "text",
      label: "Nome",
      grid: true,
      form: true,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "nomeHipoteseDiagnostica",
      type: "text",
      label: "Hipótese diagnóstica vinculada",
      grid: true,
      form: false,
      required: false,
      validator: ['', '']
    },    
    {
      field: "situacao",
      type: "checkbox",
      label: "Situação",
      grid: true,
      form: true,
      translate: {1: "Ativo", 0: "Inativo"},
      required: true,
      validator:['', Validators.required]
    }
  ];

  public buscaPorId(id: number): Observable<any> {
    return this.http.get("tipo-exame/" + id);
  }

  public cadastra(obj: TipoExame) {
    if (obj.id) {
      return this.http
        .put('tipo-exame', JSON.stringify(obj));
    }
    else {
      return this.http
        .post('tipo-exame', JSON.stringify(obj));
    }
  }
}

