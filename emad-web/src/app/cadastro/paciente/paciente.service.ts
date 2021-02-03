import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { GenericsService } from '../../_core/_services/generics.service';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
      grid: false,
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
      field: "logradouro",
      type: "geocode",
      label: "Endereço",
      grid: false,
      form: true,
      required: false,
      validator: ['', ''],
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
      required: false,
      validator: ['', ''],
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
      validator: ['', ''],
    },
    // {
    //   field: "idUf",
    //   type: "select",
    //   label: "Estado",
    //   grid: false,
    //   form: true,
    //   required: false,
    //   validator: ['', ''],
    //   filter: {
    //     type: "select",
    //     changeMethod: 'municipio/uf',
    //     changeTarget: 'idMunicipio'
    //   },
    // },
    {
      field: "idMunicipio",
      type: "select",
      label: "Município",
      grid: false,
      form: true,
      required: false,
      validator: ['', ''],
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
      form: false,
      required: false,
      validator: ['', '']
    },
    {
      field: "gruposAtencaoContinuada",
      type: "multiSelect",
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
      grid: true,
      form: true,
      translate: {
        "1": "ATIVO",
        "0": "INATIVO",
      },
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "idEstabelecimentoCadastro",
      type: "select",
      label: "Id do estabelecimento",
      grid: false,
      form: true,
      required: false,
      validator: ['', '']
    },
    {
      field: "observacao",
      type: "text",
      label: "Observação",
      grid: true,
      form: false,
      required: false,
      validator: ['', '']
    },
    {
      field: "pacienteOutroEstabelecimento",
      type: "text",
      label: "Visualizar pacientes de outros estabelecimentos",
      grid: false,
      form: false,
      translate: { "1": "Sim", "2": "Não" },
      required: false,
      validator: ['', ''],
      filter: {
        type: "select"
      }
    }
  ];

  transfereEstabelecimento(obj: any) {
    return this.http.put('paciente/transferencia-unidade', JSON.stringify(obj));
  }

  carregaNaturalidadePorNacionalidade(id: any): Observable<any> {
    return this.http.get("uf/pais/" + id);
  }

  findHipoteseByPaciente(id: any): Observable<any> {
    return this.http.get("atendimento-hipotese/paciente/" + id);
  }

  findHipoteseByPacienteAgrupado(id: any): Observable<any> {
    return this.http.get("atendimento-hipotese/paciente-agrupado/" + id);
  }

  saveHipotese(obj: any) {
    if (obj.id) {
      return this.http
        .put('atendimento-hipotese', JSON.stringify(obj));
    }
    else {
      return this.http
        .post('atendimento-hipotese', JSON.stringify(obj));
    }
  }

  findAtendimentoByPaciente(id: any, tipo: any): Observable<any> {
    return this.http.get("atendimento/prontuario-paciente/paciente/" + id + "/tipo-atendimento/" + tipo);
  }

  findExameByPaciente(id: any): Observable<any> {
    return this.http.get("exame/prontuario-paciente/paciente/" + id);
  }

  findReceitaByPaciente(id: any): Observable<any> {
    return this.http.get("receita/prontuario-paciente/paciente/" + id);
  }

  findProntuarioVacinacaoByPaciente(id: any): Observable<any> {
    return this.http.get("receita/prontuario-vacinacao/paciente/" + id);
  }

  findCarteiraVacinacaoByPaciente(id: any): Observable<any> {
    return this.http.get("receita/carteira-vacinacao/paciente/" + id);
  }

  findAtendimentoProcedimentoByPaciente(id: any): Observable<any> {
    return this.http.get("atendimento-procedimento/paciente/" + id);
  }

  removeHipotese(params: any) {
    return this.http.delete('atendimento-hipotese/' + params);
  }

  findSinaisVitaisByPaciente(id: any, tipo: any): Observable<any> {
    return this.http.get("atendimento/prontuario-paciente/paciente/" + id + "/sinais-vitais/" + tipo);
  }

  carregaAtendimentosPorPeriodo(periodo: number): Observable<any> {
    return this.http.get("atendimentos-por-periodo?periodo="
      + periodo + "&idEstabelecimento="
      + JSON.parse(localStorage.getItem("est"))[0].id);
  }

  carregaAtendimentoSituacaoExistentePorPeriodo(periodo: number): Observable<any> {
    return this.http.get("atendimento-situacao-existente-por-periodo?periodo="
      + periodo + "&idEstabelecimento="
      + JSON.parse(localStorage.getItem("est"))[0].id);
  }

  carregaAtendimentoSituacaoPorPeriodo(periodo: number): Observable<any> {
    return this.http.get("atendimento-situacao-por-periodo?periodo="
      + periodo + "&idEstabelecimento="
      + JSON.parse(localStorage.getItem("est"))[0].id);
  }

  obterProntuarioPacienteRelatorio(idPaciente: number) : Observable<any> {
    return this.http.get('paciente/prontuario/report/' + idPaciente);
  }
}