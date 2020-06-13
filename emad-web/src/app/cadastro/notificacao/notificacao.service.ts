import { Injectable } from '@angular/core';
import { GenericsService } from '../../_core/_services/generics.service';
import { Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class NotificacaoService extends GenericsService {

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
      field: "titulo",
      type: "text",
      label: "Título",
      grid: true,
      form: true,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "descricao",
      type: "text",
      label: "Descrição",
      grid: false,
      form: true,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "idTipoUsuario",
      type: "select",
      label: "Grupo de usuário",
      grid: false,
      form: true,
      required: true,
      validator: ['', Validators.required],
      filter: {
        type: "select",
        changeMethod: 'usuario/tipo-usuario',
        changeTarget: 'idUsuario'
      },
    },
    {
      field: "idUsuario",
      type: "select",
      label: "Usuário",
      grid: false,
      form: true,
      required: false,
      validator: ['', '']
    },
    {
      field: "tipoFormatado",
      type: "text",
      label: "Tipo de notificação",
      grid: true,
      form: false,
      required: false,
      validator: ['', '']
    },
    {
      field: "nomeTipoUsuario",
      type: "text",
      label: "Grupo de usuário",
      grid: true,
      form: false,
      required: false,
      validator: ['', ''],
    },
    {
      field: "nomeUsuario",
      type: "text",
      label: "Usuário",
      grid: true,
      form: false,
      required: false,
      validator: ['', '']
    },
    {
      field: "url",
      type: "text",
      label: "Url",
      grid: false,
      form: false,
      required: false,
      validator: ['', '']
    },
    {
      field: "tipo",
      type: "select",
      label: "Tipo",
      grid: false,
      form: true,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "dataCancelamento",
      type: "text",
      label: "Data de cancelamento",
      grid: false,
      form: false,
      required: false,
      mask: "99/99/9999",
      placeholder: "99/99/9999",
      validator: ['', '']
    },
    {
      field: "motivoCancelamento",
      type: "text",
      label: "Motivo do cancelamento",
      grid: false,
      form: false,
      required: false,
      validator: ['', '']
    },
    {
      field: "dataDisponibilidade",
      type: "hidden",
      label: "Data de disponibilidade",
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
      translate: { 1: "Ativo", 0: "Inativo" },
      required: true,
      onlyCreate: true,
      validator: ['', Validators.required]
    }
  ];
}