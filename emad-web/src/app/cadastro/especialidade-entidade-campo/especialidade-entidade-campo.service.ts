import { Injectable } from '@angular/core';
import { GenericsService } from '../../_core/_services/generics.service';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class EspecialidadeEntidadeCampoService extends GenericsService {

  constructor(public http: HttpClient) {
    super(http);
  }

  public fields: any[] = [
    {
      field: 'id',
      type: 'hidden',
      label: 'Id',
      grid: true,
      form: true,
      required: false,
      validator: ['', '']
    },
    {
      field: 'idEspecialidade',
      type: 'select',
      label: 'Especialidade',
      grid: true,
      form: true,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: 'nomeEspecialnomeade',
      type: 'text',
      label: 'Especialidade',
      grid: true,
      form: false,
      required: false,
      validator: ['', '']
    },
    {
      field: 'idMaterial',
      type: 'select',
      label: 'Material',
      grid: true,
      form: true,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: 'nomeMaterial',
      type: 'text',
      label: 'Material',
      grid: true,
      form: false,
      required: false,
      validator: ['', '']
    },
    {
      field: 'situacao',
      type: 'checkbox',
      label: 'Situação',
      grid: true,
      form: true,
      translate: {1: 'Ativo', 0: 'Inativo'},
      required: true,
      validator: ['', Validators.required]
    }
  ];

  carregaEntidadeCampoPorEspecialidade(id: any): Observable<any> {
      return this.http.get('especialidade-entidade-campo/especialidade/' + id);
  }

  salvaEntidadeCampo(obj: any) {
    if (obj.id) {
        return this.http
            .put('especialidade-entidade-campo', JSON.stringify(obj));
    } else {
        return this.http
            .post('especialidade-entidade-campo', JSON.stringify(obj));
    }
  }

  removeEntidadeCampo(params: any) {
    return this.http.delete('especialidade-entidade-campo/' + params);
  }
}
