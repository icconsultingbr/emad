import { Injectable } from '@angular/core';
import { GenericsService } from '../../../_core/_services/generics.service';
import { Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SubGrupoOrigemReceitaService extends GenericsService {

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
      field: "idGrupoOrigemReceita",
      type: "select",
      label: "Grupo origem da receita",
      grid: false,
      form: true,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "nomeGrupoOrigemReceita",
      type: "text",
      label: "Grupo origem da receita",
      grid: true,
      form: false,
      required: false,
      validator: ['', '']
    },
    {
      field: "nome",
      type: "text",
      label: "Nome do subgrupo",
      grid: true,
      form: true,
      required: false,
      validator: ['', '']
    },
    {
      field: "exibirCidade",
      type: "checkbox",
      label: "Exibir cidade",
      grid: true,
      form: true,
      translate: {1: "Sim", 0: "Não"},
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
}