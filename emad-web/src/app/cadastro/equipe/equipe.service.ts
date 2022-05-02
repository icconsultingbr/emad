import { Injectable } from '@angular/core';
import { GenericsService } from '../../_core/_services/generics.service';
import { Validators } from '@angular/forms';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class EquipeService extends GenericsService {

  constructor(public http: HttpClient) {
    super(http);
  }

  fields: any[] = [
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
      field: "equipe",
      type: "select",
      label: "Equipe",
      toggleFields: [
        {
          value: "EMAP",
          hide: ['cnes', 'nome', 'tipo', 'idEstabelecimento'],
          show: ['idEquipeEmad', 'profissionais', 'situacao']
        },
        {
          value: "EMAD",
          show: ['cnes', 'nome', 'tipo', 'idEstabelecimento', 'profissionais', 'situacao'],
          hide: ['idEquipeEmad']
        },
        {
          value: undefined,
          hide: ['cnes', 'nome', 'tipo', 'idEstabelecimento', 'idEquipeEmad', 'profissionais', 'situacao']
        }
      ],
      grid: true,
      form: true,
      required: true,
      validator: ['', Validators.required],
      filter: {
        type: "select",
        changeMethod: 'profissional/equipe',
        changeTarget: 'profissionais'
      },
      autoFocus: true
    },
    {
      field: "ine",
      type: "text",
      label: "INE",
      grid: false,
      form: true,
      required: false,
      validator: ['', ''],
    },

    {
      field: "nome",
      type: "text",
      label: "Nome",
      grid: true,
      form: true,
      required: false,
      validator: ['', ''],
    },
    {
      field: "tipo",
      type: "select",
      label: "Tipo",
      grid: false,
      form: true,
      required: true,
      validator: ['', ''],
    },
    {
      field: "idEstabelecimento",
      type: "select",
      label: "Estabelecimento",
      grid: true,
      form: true,
      required: true,
      validator: ['', Validators.required],
      filter: {
        type: "select",
        changeMethod: 'profissional/estabelecimento',
        changeTarget: 'profissionais',
        grid: true
      }
    },
    {
      field: "idEquipeEmad",
      type: "select",
      label: "Equipe EMAD",
      grid: true,
      form: true,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "profissionais",
      type: "multiSelect",
      label: "Profissionais",
      grid: false,
      form: true,
      required: false,
      validator: ['', '']
    },
    {
      field: "situacao",
      type: "checkbox",
      label: "Situação",
      translate: { "1": "Ativo", "0": "Inativo" },
      grid: true,
      form: true,
      required: true,
      validator: ['', Validators.required]
    }
  ];
}
