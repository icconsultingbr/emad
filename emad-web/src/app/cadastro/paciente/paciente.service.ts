import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { GenericsService } from '../../_core/_services/generics.service';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PacienteService extends GenericsService {

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
      field: "cartaoSus",
      type: "text",
      label: "Cartão SUS",
      grid: true,
      form: true,
      required: false,
      validator: ['', ''],
      autoFocus: true,
      filter: {
        type: "text"
      }
    },
    {
      field: "idSap",
      type: "text",
      label: "ID SAP",
      grid: true,
      form: true,
      required: false,
      autoFocus: true,
      filter: {
        type: "text"
      }
    },
    {
      field: "nome",
      type: "text",
      label: "Nome",
      grid: true,
      form: true,
      required: true,
      validator: ['', Validators.required],
      filter: {
        type: 'text'
      }
    },

    {
      field: "nomeSocial",
      type: "text",
      label: "Nome social",
      grid: false,
      form: true,
      required: false,
      validator: ['', ''],
    },
    {
      field: "nomeMae",
      type: "text",
      label: "Nome da mãe",
      grid: false,
      form: true,
      required: true,
      validator: ['', Validators.required],
    },
    {
      field: "nomePai",
      type: "text",
      label: "Nome do pai",
      grid: false,
      form: true,
      required: false,
      validator: ['', ''],
    },
    {
      field: "dataNascimento",
      type: "text",
      mask: "99/99/9999",
      placeholder: "99/99/9999",
      label: "Data de nascimento",
      grid: true,
      //isDate: true,
      form: true,
      required: true,
      validator: ['', Validators.required],
    },
    {
      field: "sexo",
      type: "select",
      label: "Sexo",
      grid: true,
      form: true,
      translate: { "1": "Masculino", "2": "Feminino", "3": "Ambos", "4": "Não informado" },
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "idNacionalidade",
      type: "select",
      label: "Nacionalidade",
      grid: false,
      form: true,
      required: true,
      validator: ['', Validators.required],
      filter: {
        type: "select",
        changeMethod: 'uf/pais',
        changeTarget: 'idNaturalidade'
      },
    },
    {
      field: "idNaturalidade",
      type: "select",
      label: "Naturalidade",
      grid: false,
      form: true,
      required: true,
      validator: ['', Validators.required],

    },
    {
      field: "ocupacao",
      type: "text",
      label: "Ocupação",
      grid: false,
      form: true,
      required: false,
      validator: ['', ''],

    },
    {
      field: "cpf",
      type: "text",
      label: "CPF",
      grid: true,
      form: true,
      required: false,
      validator: ['', ''],
      filter: {
        type: 'text',
        placeHolder: '999.999.999-99',
        mask: '999.999.999-99'
      }
    },
    {
      field: "rg",
      type: "text",
      label: "RG",
      grid: false,
      form: true,
      required: false,
      validator: ['', '']
    },
    {
      field: "dataEmissao",
      type: "text",
      label: "Data de emissão",
      mask: "99/99/9999",
      placeholder: "99/99/9999",
      grid: false,
      form: true,
      required: false,
      validator: ['',],

    },
    {
      field: "orgaoEmissor",
      type: "text",
      label: "Órgão emissor",
      grid: false,
      form: true,
      required: false,
      validator: ['', ''],

    },
    {
      field: "escolaridade",
      type: "select",
      label: "Escolaridade",
      grid: false,
      form: true,
      required: true,
      validator: ['', Validators.required],

    },
    {
      field: "logradouro",
      type: "geocode",
      label: "Endereço",
      grid: false,
      form: true,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "latitude",
      type: "text",
      label: "Latitude",
      grid: false,
      form: true,
      required: false,
      readonly: true,
      validator: ['', '']
    },
    {
      field: "longitude",
      type: "text",
      label: "Longitude",
      grid: false,
      form: true,
      required: false,
      readonly: true,
      validator: ['', '']
    },
    {
      field: "numero",
      type: "text",
      label: "Número",
      grid: false,
      form: true,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "complemento",
      type: "text",
      label: "Complemento",
      grid: false,
      form: true,
      required: false,
      validator: ['', '']
    },
    {
      field: "bairro",
      type: "text",
      label: "Bairro",
      grid: false,
      form: true,
      required: true,
      validator: ['', Validators.required]
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
      field: "cep",
      type: "text",
      label: "CEP",
      grid: false,
      form: true,
      required: true,
      validator: ['', Validators.required],
      mask: "99999-999",
      placeholder: "00000-000",
      /*
      onBlur: {
        url: "endereco/cep",
        targets: [
          { field: 'logradouro' },
          { field: 'bairro' },
          { field: 'idUf' },
          { field: 'idMunicipio' }
        ],
      },
      */
    },
    {
      field: "foneResidencial",
      type: "text",
      label: "Telefone residencial",
      placeholder: "(99) 9999-9999",
      mask: "(99) 9999-9999",
      grid: false,
      form: true,
      required: false,
      validator: ['', '']
    },
    {
      field: "foneCelular",
      type: "text",
      placeholder: "(99) 99999-9999",
      mask: "(99) 99999-9999",
      label: "Telefone celular",
      grid: false,
      form: true,
      required: false,
      validator: ['', '']
    },
    {
      field: "foneContato",
      type: "text",
      placeholder: "(99) 9999-9999",
      mask: "(99) 9999-9999",
      label: "Telefone de contato",
      grid: false,
      form: true,
      required: false,
      validator: ['', '']
    },
    {
      field: "contato",
      type: "text",
      label: "Contato",
      grid: false,
      form: true,
      required: false,
      validator: ['', '']
    },
    {
      field: "email",
      type: "text",
      label: "E-mail",
      grid: false,
      form: true,
      required: false,
      validator: ['', '']
    },
    {
      field: "idModalidade",
      type: "select",
      label: "Modalidade",
      grid: false,
      form: true,
      required: false,
      validator: ['', '']
    },
    {
      field: "idTipoSanguineo",
      type: "select",
      label: "Tipo sanguíneo",
      grid: false,
      form: true,
      translate: {
        "1": "A_POSITIVO",
        "2": "A_NEGATIVO",
        "3": "B_POSITIVO",
        "4": "B_NEGATIVO",
        "5": "AB_POSITIVO",
        "6": "AB_NEGATIVO",
        "7": "O_POSITIVO",
        "8": "O_NEGATIVO"
      },
      required: false,
      validator: ['', '']
    },
    {
      field: "idRaca",
      type: "select",
      label: "Raça/Cor",
      grid: false,
      form: true,
      required: false,
      validator: ['', '']
    },
    {
      field: "numeroProntuario",
      type: "text",
      label: "Número prontuário",
      grid: false,
      form: true,
      required: false,
      validator: ['', '']
    },
    {
      field: "numeroProntuarioCnes",
      type: "text",
      label: "Número prontuário Cnes",
      grid: false,
      form: true,
      required: false,
      validator: ['', '']
    },
    {
      field: "idAtencaoContinuada",
      type: "select",
      label: "Grupo de atenção continuada",
      grid: false,
      form: true,
      required: false,
      validator: ['', '']
    },
    {
      field: "falecido",
      type: "checkbox",
      label: "Falecido",
      grid: false,
      form: true,
      required: false,
      validator: ['', '']
    },
    {
      field: "situacao",
      type: "checkbox",
      label: "Situação",
      grid: false,
      form: true,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "idEstabelecimentoCadastro",
      type: "hidden",
      label: "Id do estabelecimento",
      grid: false,
      form: true,
      required: false,
      validator: ['', '']
    },
  ];
}