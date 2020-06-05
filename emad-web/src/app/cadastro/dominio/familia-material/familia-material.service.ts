import { Injectable } from '@angular/core';
import { GenericsService } from '../../../_core/_services/generics.service';
import { Validators } from '@angular/forms';

@Injectable()
export class FamiliaMaterialService extends GenericsService {

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
      validator: ['', Validators.required],
      filter: {
        type: "select",
        changeMethod: 'sub-grupo-material/grupo-material',
        changeTarget: 'idSubGrupoMaterial' 
      },
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
      field: "idSubGrupoMaterial",
      type: "select",
      label: "Subgrupo de material",
      grid: false,
      form: true,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "nomeSubGrupoMaterial",
      type: "text",
      label: "Subgrupo de material",
      grid: true,
      form: false,
      required: false,
      validator: ['', '']
    },
    {
      field: "nome",
      type: "text",
      label: "Nome da família",
      grid: true,
      form: true,
      required: true,
      validator: ['', Validators.required]
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