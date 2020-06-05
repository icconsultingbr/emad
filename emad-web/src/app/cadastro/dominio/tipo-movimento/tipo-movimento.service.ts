import { Injectable } from '@angular/core';
import { GenericsService } from '../../../_core/_services/generics.service';
import { Validators } from '@angular/forms';

@Injectable()
export class TipoMovimentoService extends GenericsService {

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
      field: "operacao",
      type: "select",
      label: "Operação",
      grid: true,
      form: true,
      translate: {1: "Entrada", 2: "Saída", 3: "Perda"},
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "movimentoAdministrativo",
      type: "checkbox",
      label: "Movimento administrativo",
      grid: false,
      form: true,
      required: true,
      validator: ['', '']
    },
    {
      field: "loteBloqueado",
      type: "select",
      label: "Lote bloqueado",
      grid: false,
      form: true,
      translate: {1: "", 2: "Sim", 3: "Não"},
      required: false,
      validator: ['', '']
    },
    {
      field: "loteVencido",
      type: "select",
      label: "Lote vencido",
      grid: false,
      form: true,
      translate: {1: "", 2: "Sim", 3: "Não"},
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