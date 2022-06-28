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
      field: "tipo",
      type: "select",
      label: "Tipo",
      grid: true,
      form: true,
      required: true,
      translate: { "8": "08 - EMSI", "22": "22 - EMAD", "23": "23 - EMAP", "46": "46 - EMAD", "47": "47 - EAD"
                 , "70": "70 - eSF", "71": "71 - eSB", "72": "72 - eNASF-AP", "73": "73 - eCR", "74": "74 - eAPP"
                 , "75": "75 - eMAESM", "76": "76 - eAP" },
      validator: ['', ''],
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
      field: "idEstabelecimento",
      type: "select",
      label: "Estabelecimento",
      grid: false,
      form: true,
      required: false,
      validator: ['', ''],
    },
    {
      field: "nomeEstabelecimento",
      type: "text",
      label: "Estabelecimento",
      grid: true,
      form: false,
      required: false,
      validator: ['', ''],
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
