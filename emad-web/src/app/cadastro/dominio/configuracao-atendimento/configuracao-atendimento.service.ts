import { Injectable } from '@angular/core';
import { GenericsService } from '../../../_core/_services/generics.service';
import { Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ConfiguracaoAtendimentoService extends GenericsService {

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
      field: "estabelecimento",
      type: "text",
      label: "Estabelecimento",
      grid: true,
      form: false,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "especialidade",
      type: "text",
      label: "Especialidade",
      grid: true,
      form: false,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "tipoFicha",
      type: "text",
      label: "Tipo de ficha",
      grid: true,
      form: false,
      required: true,
      validator: ['', Validators.required]
    },
  ];

  public formFields: any[] = [
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
      field: "estabelecimento",
      type: "text",
      label: "Estabelecimento",
      grid: false,
      form: true,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "especialidade",
      type: "text",
      label: "Especialidade",
      grid: false,
      form: true,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "tipoFicha",
      type: "text",
      label: "Tipo de ficha",
      grid: false,
      form: true,
      required: true,
      validator: ['', Validators.required]
    },
  ];

  saveConfiguracaoAtendimento(obj: any) {
    return this.http.post('configuracao-atendimento/', JSON.stringify(obj));
  }
  deleteConfiguracaoAtendimento(id: any) {
    return this.http.delete('configuracao-atendimento/' + id);
  }

  public buscaPorId(id: number): Observable<any> {
    return this.http.get("configuracao-atendimento/" + id);
  }
}

