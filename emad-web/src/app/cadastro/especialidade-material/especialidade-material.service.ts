import { Injectable } from '@angular/core';
import { GenericsService } from '../../_core/_services/generics.service';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class EspecialidadeMaterialService extends GenericsService {

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
      field: "idEspecialidade",
      type: "select",
      label: "Especialidade",
      grid: true,
      form: true,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "nomeEspecialnomeade",
      type: "text",
      label: "Especialidade",
      grid: true,
      form: false,
      required: false,
      validator: ['', '']
    },
    {
      field: "idMaterial",
      type: "select",
      label: "Material",
      grid: true,
      form: true,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "nomeMaterial",
      type: "text",
      label: "Material",
      grid: true,
      form: false,
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

  carregaMaterialPorEspecialidade(id: any): Observable<any> {
      return this.http.get(this.url + "especialidade-material/especialidade/" + id, { headers: this.headers }).map(res => res.json());
  }

  salvaMaterial(obj: any) {
    if (obj.id) {
        return this.http
            .put(this.url + 'especialidade-material', JSON.stringify(obj), { headers: this.headers })
            .map((res) => res.json());
    }
    else {
        return this.http
            .post(this.url + 'especialidade-material', JSON.stringify(obj), { headers: this.headers })
            .map((res) => res.json());
    }
  }

  removeMaterial(params: any) {
    return this.http.delete(this.url + 'especialidade-material/' + params, { headers: this.headers }).map(res => res.json());
  }
}