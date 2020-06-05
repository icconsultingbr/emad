import { Injectable } from '@angular/core';
import { GenericsService } from '../../../_core/_services/generics.service';
import { Validators } from '@angular/forms';

@Injectable()
export class ListaControleEspecialService extends GenericsService {

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
      field: "codigoLista",
      type: "text",
      label: "Código",
      grid: true,
      form: true,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "listaControleEspecial",
      type: "text",
      label: "Descrição da lista",
      grid: true,
      form: true,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "idLivro",
      type: "select",
      label: "Livro",
      grid: false,
      form: true,
      required: false,
      validator: ['', '']
    },
    {
      field: "nomeLivro",
      type: "text",
      label: "Livro",
      grid: true,
      form: false,
      required: false,
      validator: ['', '']
    },
    {
      field: "receitaControlada",
      type: "checkbox",
      label: "Receita controlada",
      grid: false,
      form: true,
      required: false,
      validator: ['', '']
    },
    {
      field: "medicamentoControlado",
      type: "checkbox",
      label: "Medicamento controlado",
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