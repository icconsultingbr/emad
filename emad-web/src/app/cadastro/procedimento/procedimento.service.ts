import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { GenericsService } from '../../_core/_services/generics.service';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ProcedimentoService extends GenericsService {

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
    },
    {
      field: "co_procedimento",
      type: "text",
      label: "Código procedimento",
      grid: true,
      form: true,
      required: true,
      validator: ['', Validators.required],
    },
    {
      field: "no_procedimento",
      type: "text",
      label: "Nome procedimento",
      grid: true,
      form: true,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "dt_competencia_formatada",
      type: "text",
      label: "Competência",
      grid: true,
      form: false,
      required: false,
      validator: ['', ''],
    },
    {
      field: "dt_competencia",
      type: "text",
      label: "Competência",
      grid: false,
      form: true,
      required: false,
      validator: ['', ''],
    }
  ];
}