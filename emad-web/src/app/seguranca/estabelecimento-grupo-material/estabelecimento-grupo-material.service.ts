import { Injectable } from '@angular/core';
import { GenericsService } from '../../_core/_services/generics.service';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class EstabelecimentoGrupoMaterialService extends GenericsService {

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
      field: "idEstabelecimento",
      type: "hidden",
      label: "Estabelecimento",
      grid: false,
      form: true,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "nomeEstabelecimento",
      type: "text",
      label: "Estabelecimento",
      grid: true,
      form: false,
      required: false,
      validator: ['', '']
    },
    {
      field: "idGrupoMaterial",
      type: "select",
      label: "Grupo de material",
      grid: false,
      form: true,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "nomeGrupoMaterial",
      type: "text",
      label: "Grupo de material",
      grid: true,
      form: false,
      required: false,
      validator: ['', '']
    },
    {
      field: "principal",
      type: "checkbox",
      label: "Principal",
      grid: true,
      form: true,
      required: false,
      translate: {1: "Sim", 0: "Não"},
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

  carregaGrupoSemEstabelecimento(): Observable<any> {
    return this.http.get("grupo-material/estabelecimento/" + JSON.parse(localStorage.getItem("est"))[0].id);
  }
}