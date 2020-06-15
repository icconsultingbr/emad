import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TipoUsuario } from '../../_core/_models/TipoUsuario';
import { Validators } from '@angular/forms';
import { Menu } from '../../_core/_models/Menu';
import { GenericsService } from '../../_core/_services/generics.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TipoUsuarioService extends GenericsService {

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
      field: "periodoSenha",
      type: "text",
      label: "Período de troca da senha (dias)",
      grid: true,
      form: true,
      required: true,
      validator: ['', Validators.required],
      autoFocus: true
    }
  ];

  buscaPorId(id: string): Observable<TipoUsuario> {
    return this.http.get<TipoUsuario>("tipo-usuario/" + id);
  }

  cadastra(tipoUsuario: TipoUsuario) {
    if (tipoUsuario.id) {
      return this.http
        .put('tipo-usuario', JSON.stringify(tipoUsuario));
    }
    else {
      return this.http
        .post('tipo-usuario', JSON.stringify(tipoUsuario));
    }
  }

  remove(mensagem: any) {
    return this.http.delete('tipo-usuario' + '/' + mensagem.id);
  }

  listMenuTipoUsuario(id: number): Observable<Menu[]> {
    return this.http.get<Menu[]>('menu/tipo-usuario/descricao/' + id);
  }

  listMenu(): Observable<Menu[]> {
    return this.http.get<Menu[]>('menu/descricao');
  }
}
