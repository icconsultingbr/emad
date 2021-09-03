import { Injectable } from '@angular/core';
import { MaxLengthValidator, Validators } from '@angular/forms';
import { GenericsService } from '../../_core/_services/generics.service';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ProfissionalService extends GenericsService {

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
      field: "nome",
      type: "text",
      label: "Nome",
      grid: true,
      form: true,
      required: true,
      validator: ['', Validators.required],
      autoFocus: true
    },
    {
      field: "cpf",
      type: "text",
      label: "CPF",
      grid: false,
      form: true,
      mask: "999.999.999-99",
      placeholder: "999.999.999-99",
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "nomeMae",
      type: "text",
      label: "Nome da mãe",
      grid: false,
      form: true,
      required: false,
      validator: ['', ''],
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
      isDate: true,
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
      translate: { "M": "Masculino", "F": "Feminino" },
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "idNacionalidade",
      type: "select",
      label: "Nacionalidade",
      grid: false,
      form: true,
      required: false,
      validator: ['', ''],
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
      required: false,
      validator: ['', ''],

    },
    {
      field: "profissionalSus",
      type: "select",
      label: "Profissional do SUS",
      grid: false,
      form: true,
      required: true,
      validator: ['', Validators.required],
    },
    {
      field: "rg",
      type: "text",
      label: "RG",
      grid: false,
      form: true,
      required: false,
      validator: ['', ''],
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
      validator: ['', ''],
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
      required: false,
      validator: ['', ''],
    },
    {
      field: "logradouro",
      type: "geocode",
      label: "Endereço",
      grid: false,
      form: true,
      required: false,
      validator: ['', '']
    },
    {
      field: "numero",
      type: "text",
      label: "Número",
      grid: false,
      form: true,
      required: false,
      validator: ['', '']
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
      field: "cep",
      type: "text",
      label: "CEP",
      grid: false,
      form: true,
      required: false,
      validator: ['', ''],
      mask: "99999-999",
      placeholder: "00000-000",
      /*
      onBlur : {
        url : "endereco/cep",
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
      placeholder: "(99) 9999-9999",
      mask: "(99) 9999-9999",
      label: "Telefone resid.",
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
      field: "email",
      type: "text",
      label: "E-mail",
      grid: false,
      form: true,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "idEspecialidade",
      type: "select",
      label: "Especialidade",
      grid: true,
      form: true,
      required: true,
      validator: ['', Validators.required],
      filter: {
        type: "select"
      }
    },
    {
      field: "vinculo",
      type: "select",
      label: "Vínculo",
      grid: false,
      form: true,
      required: false,
      validator: ['', '']
    },
    {
      field: "idConselho",
      type: "select",
      label: "Conselho",
      grid: false,
      form: true,
      required: false,
      validator: ['', Validators.required],
    },
    {
      field: "crm",
      type: "text",
      label: "Número do conselho",
      grid: false,
      form: true,
      required: true,
      validator: ['', Validators.required],
    },
    {
      field: "profissionalCNS",
      type: "text",
      label: "CNS",
      grid: false,
      form: true,
      required: true,
      validator: ['', Validators.required],
    },
    {
      field: "cargaHorariaSemanal",
      type: "text",
      mask: "9999999",
      label: "Carga hor. semanal",
      grid: false,
      form: true,
      required: false,
      validator: ['','']
    },
    {
      field: "cargoProfissional",
      type: "text",
      label: "Cargo profissional",
      grid: false,
      form: true,
      required: false,
      validator: ['', '']
    },
    {
      field: "nomeUsuario",
      type: "text",
      label: "Usuário vinculado",
      grid: true,
      form: false,
      required: false,
      validator: ['', '']
    },
    {
      field: "idEstabelecimento",
      type: "hidden",
      label: "Estabelecimento",
      grid: false,
      form: true,
      required: true,
      readonly: true,
      validator: ['', ''],
      filter: {
        type: "select",
        grid: true
      }
    },
    {
      field: "idTipoUsuario",
      type: "select",
      label: "Grupo de Usuário",
      grid: false,
      required: true,
      form: true,
      validator: ['', Validators.required]
    },
    {
      field: "senha",
      type: "password",
      label: "Senha",
      grid: false,
      required: true,
      form: true,
      validator: ['', Validators.required],
      onlyCreate: true
    },
    {
      field: "confirmaSenha",
      type: "password",
      label: "Cofirme a Senha",
      grid: false,
      required: true,
      form: true,
      validator: ['', Validators.required],
      onlyCreate: true
    },
    {
      field: "estabelecimentos",
      type: "multiSelect",
      label: "Estabelecimentos",
      grid: false,
      form: true,
      required: true,
      validator: ['', '']
    }
  ];
}