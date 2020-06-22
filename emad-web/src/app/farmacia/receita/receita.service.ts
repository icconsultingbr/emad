import { Injectable } from '@angular/core';
import { GenericsService } from '../../_core/_services/generics.service';
import { Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ReceitaService extends GenericsService {

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
      type: "select",
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
      field: "idUf",
      type: "select",
      label: "Estado",
      grid: false,
      form: true,
      required: true,
      validator: ['', Validators.required],
      filter: {
        type: "select",
        changeMethod: 'municipio/uf',
        changeTarget: 'idMunicipio'
      },
    },
    {
      field: "idMunicipio",
      type: "select",
      label: "Município",
      grid: false,
      form: true,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "idProfissional",
      type: "select",
      label: "Profissional",
      grid: false,
      form: true,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "nomeProfissional",
      type: "text",
      label: "Profissional",
      grid: true,
      form: false,
      required: false,
      validator: ['', '']
    },
    {
      field: "idPaciente",
      type: "select",
      label: "Paciente",
      grid: false,
      form: false,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "nomePaciente",
      type: "text",
      label: "Paciente",
      grid: true,
      form: false,
      required: false,
      validator: ['', '']
    },
    {
      field: "idSubgrupoOrigem",
      type: "select",
      label: "Origem",
      grid: false,
      form: true,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "ano",
      type: "text",
      label: "Ano",
      grid: true,
      form: true,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "numero",
      type: "text",
      label: "Número",
      grid: true,
      form: true,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "dataEmissao",
      type: "hidden",
      label: "Data emissão",
      grid: false,
      form: true,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "dataUltimaDispensacao",
      type: "hidden",
      label: "Data dispensação",
      grid: false,
      form: true,
      required: false,
      validator: ['', '']
    },
    {
      field: "idMotivoFimReceita",
      type: "select",
      label: "Motivo fim receita",
      grid: false,
      form: false,
      required: false,
      validator: ['', '']
    },
    {
      field: "idPacienteOrigem",
      type: "select",
      label: "Paciente origem",
      grid: false,
      form: false,
      required: false,
      validator: ['', '']
    },
    {
      field: "idMandadoJudicial",
      type: "select",
      label: "Número processo",
      grid: false,
      form: false,
      required: false,
      validator: ['', '']
    },
    {
      field: "situacao",
      type: "text",
      label: "Situação",
      grid: true,
      form: false,
      translate: { "A": "Alta", "C": "Em aberto", "E": "Evasão", "O": "Óbito", "X": "Cancelado" },
      required: true,
      validator: ['', ''],
      filter: {
          type: "select",
          grid: true
      }
    }
  ];
}