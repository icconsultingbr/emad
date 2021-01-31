import { Injectable } from '@angular/core';
import { GenericsService } from '../../_core/_services/generics.service';
import { Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ExameService extends GenericsService {

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
      field: "nomeTipoExame",
      type: "text",
      label: "Tipo exame",
      grid: true,
      form: false,
      required: false,
      validator: ['', '']
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
      field: "idEstabelecimento",
      type: "text",
      label: "Id do estabelecimento",
      grid: false,
      form: false,
      required: true,
      validator: ['', ''],
      filter: {
          type: "select"
      }
    },
    {
      field: "resultado",
      type: "text",
      label: "Resultado",
      grid: true,
      form: false,
      translate: { "1": "Amostra não reagente", "2": "Amostra reagente", "3": "Não realizado" },
      required: true,
      validator: ['', ''],
      filter: {
          type: "select",
          grid: true
      }
    },
    {
      field: "situacao",
      type: "text",
      label: "Situação",
      grid: true,
      form: false,
      translate: { "1": "Aberto", "2": "Finalizado" },
      required: true,
      validator: ['', ''],
      filter: {
          type: "select",
          grid: true
      }
    }
  ];

  inserir(obj: any, metodo: string){ 
    if(obj.id){
      return this.http
      .put(metodo, JSON.stringify(obj));
    }
    else{
      return this.http
      .post(metodo, JSON.stringify(obj));
    }
  }

  obterRelatorio(ano: number, idEstabelecimento: number, numero: number): Observable<any>{ 
    return this.http.get("receita" + "/ano/" + ano + "/idEstabelecimento/" + idEstabelecimento + "/numero/" + numero);
  }

  obterMaterialDispensadoPorPaciente(idMaterial: number, idPaciente: number): Observable<any>{ 
    return this.http.get("item-receita" + "/idMaterial/" + idMaterial + "/idPaciente/" + idPaciente);
  }
}

