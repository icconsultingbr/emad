import { Injectable } from '@angular/core';
import { GenericsService } from '../../../_core/_services/generics.service';
import { Validators } from '@angular/forms';

@Injectable()
export class SubGrupoMaterialService extends GenericsService {

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
      field: "nome",
      type: "text",
      label: "Nome do subgrupo",
      grid: true,
      form: true,
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