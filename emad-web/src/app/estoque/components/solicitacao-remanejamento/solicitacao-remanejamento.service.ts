import { Injectable } from '@angular/core';
import { GenericsService } from '../../../_core/_services/generics.service';
import { Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SolicitacaoRemanejamentoService extends GenericsService {

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
      field: "idEstabelecimentoSolicitante",
      type: "select",
      label: "Unidade solicitante",
      grid: false,
      form: true,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "nomeEstabelecimentoSolicitante",
      type: "text",
      label: "Unidade solicitante",
      grid: true,
      form: false,
      required: false,
      validator: ['', '']
    },
    {
      field: "idEstabelecimentoSolicitada",
      type: "select",
      label: "Unidade solicitada",
      grid: false,
      form: true,
      required: true,
      readonly: true,
      validator: ['', Validators.required]
    },
    {
      field: "nomeEstabelecimentoSolicitada",
      type: "text",
      label: "Unidade solicitada",
      grid: true,
      form: false,
      required: false,
      validator: ['', '']
    },    
    {
      field: "dataCriacao",
      type: "hidden",
      label: "Data solicitação",
      grid: true,
      form: false,
      isDate: true,
      required: false,
      validator: ['', ''],
      filter: {
        type: 'date',
        placeHolder: '99/99/9999',
        grid: true
      },
    },
    {
      field: "situacao",
      type: "checkbox",
      label: "Situação",
      grid: true,
      form: false,
      translate: {0: "INATIVA", 1: "PENDENTE MATERIAL", 2: "SOLICITADA",  3: "ATENDIDA", 4: "RESERVADA", 5 : "NÃO ATENDIDA"},
      required: true,
      validator:['', Validators.required]
    }
  ];

  inserir(obj: any) {
    if (obj.id) {
        return this.http
            .put('solicitacao-remanejamento', JSON.stringify(obj));
    }
    else {
        return this.http
            .post('solicitacao-remanejamento', JSON.stringify(obj));
    }
  }
}