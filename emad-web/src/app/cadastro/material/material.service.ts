import { Injectable } from '@angular/core';
import { GenericsService } from '../../_core/_services/generics.service';
import { Validators } from '@angular/forms';

@Injectable()
export class MaterialService extends GenericsService {

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
      field: "codigo",
      type: "text",
      label: "Código",
      grid: true,
      form: true,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "descricao",
      type: "text",
      label: "Descrição",
      grid: true,
      form: true,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "idUnidadeMaterial",
      type: "select",
      label: "Unidade dispensada",
      grid: false,
      form: true,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "dispensavel",
      type: "checkbox",
      label: "Dispensável",
      grid: true,
      form: true,
      translate: {1: "Sim", 0: "Não"},
      required: false,
      validator: ['', '']
    },
    {
      field: "periodoDispensavel",
      type: "text",
      label: "Período dispensável",
      grid: false,
      form: true,
      required: false,
      validator: ['', '']
    },
    {
      field: "necessitaAutorizacao",
      type: "checkbox",
      label: "Necessita autorização",
      grid: false,
      form: true,
      required: false,
      validator: ['', '']
    },
    {
      field: "estoqueMinimo",
      type: "text",
      label: "Estoque mínimo",
      grid: false,
      form: true,
      required: false,
      validator: ['', '']
    },
    {
      field: "generico",
      type: "checkbox",
      label: "Genérico",
      grid: false,
      form: true,
      required: false,
      validator: ['', '']
    },
    {
      field: "idListaControleEspecial",
      type: "select",
      label: "Lista controle especial",
      grid: false,
      form: true,
      required: false,
      validator: ['', '']
    },
    {
      field: "idGrupoMaterial",
      type: "select",
      label: "Grupo",
      grid: false,
      form: true,
      required: false,
      validator: ['', ''],
      filter: {
        type: "select",
        changeMethod: 'sub-grupo-material/grupo-material',
        changeTarget: 'idSubGrupoMaterial' 
      },
    },
    {
      field: "idSubGrupoMaterial",
      type: "select",
      label: "Subgrupo",
      grid: false,
      form: true,
      required: false,
      validator: ['', ''],
      filter: {
        type: "select",
        changeMethod: 'familia-material/sub-grupo-material',
        changeTarget: 'idFamiliaMaterial' 
      },
    },
    {
      field: "idFamiliaMaterial",
      type: "select",
      label: "Família",
      grid: false,
      form: true,
      required: false,
      validator: ['', '']
    },
    {
      field: "idTipoMaterial",
      type: "select",
      label: "Tipo",
      grid: false,
      form: true,
      required: false,
      validator: ['', '']
    },
    {
      field: "descricaoCompleta",
      type: "textarea",
      label: "Descrição completa",
      grid: false,
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