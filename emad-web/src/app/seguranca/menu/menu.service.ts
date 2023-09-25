import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Menu } from '../../_core/_models/Menu';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MenuService {

  private http: HttpClient;

  fields: any[] = [
    { field: 'id', type: 'hidden', label: 'Id', grid: false, form: true, required: false, validator: ['', ''] },
    { field: 'nome', type: 'text', label: 'Nome', grid: true, form: true, required: true, validator: ['', Validators.required] },
    {
      field: 'menuPai',
      type: 'select',
      label: 'Menu Pai',
      grid: true,
      form: true,
      required: false,
      validator: ['', ''],
      filter: {
        type: 'select',
        changeMethod: 'menu/ordem-menu-filho',
        changeTarget: 'ordem'
      },

    },
    { field: 'icone', type: 'text', label: 'Ícone', grid: false, form: true, required: false, validator: ['', ''] },
    { field: 'rota', type: 'text', label: 'Rota', grid: true, form: true, required: true, validator: ['', Validators.required] },
    { field: 'ordem', type: 'select', label: 'Ordem', grid: false, form: true, required: true, validator: ['1', Validators.required] },
    { field: 'situacao', type: 'checkbox', label: 'Situação', form: true, grid: true, required: true, validator: ['', ''] },
  ];

  constructor(httpClient: HttpClient) {
    this.http = httpClient;
  }

  list(method: string): Observable<Menu[]> {
    return this.http.get<any>(method);
  }

  listOrdem(method: string): Observable<any> {
    return this.http.get<any>(method);
  }
}
