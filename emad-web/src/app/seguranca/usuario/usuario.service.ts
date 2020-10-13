import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Usuario } from '../../_core/_models/Usuario';
import { Senha } from '../../_core/_models/Senha';
import { GenericsService } from '../../_core/_services/generics.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class UsuarioService extends GenericsService {

  constructor(public http: HttpClient) {
    super(http);
  }

  fields: any[] = [
    {
      field: "id",
      type: "hidden",
      label: "Id",
      grid: false,
      required: false,
      validator: ['', '']
    },
    {
      field: "foto",
      type: "image",
      label: "Foto",
      grid: true,
      required: false,
      validator: ['', ''],
      path: `${environment.apiUrl}/profile/`,
      imgDefault: "user_default.jpg"
    },
    {
      field: "idTipoUsuario",
      type: "select",
      label: "Grupo de Usuário",
      grid: true,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "nome",
      type: "text",
      label: "Nome",
      grid: true,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "cpf",
      type: "text",
      label: "CPF",
      grid: false,
      required: true,
      validator: ['', Validators.required],
      placeholder: "999.999.999-99",
      mask: "000.000.000-00"
    },
    {
      field: "nomeMae",
      type: "text",
      label: "Nome da mãe",
      grid: false,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "dataNascimento",
      type: "text",
      label: "Data nasc.",
      grid: true,
      required: true,
      validator: ['', Validators.required],
      placeholder: "99/99/9999",
      mask: "00/00/0000",
      isDate: true
    },
    {
      field: "sexo",
      type: "select",
      label: "Sexo",
      grid: true,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "email",
      type: "text",
      label: "Email",
      grid: true,
      required: true,
      validator: ['',
        [Validators.required, Validators.email]]
    },
    {
      field: "senha",
      type: "password",
      label: "Senha",
      grid: false,
      required: true,
      validator: ['', Validators.required],
      onlyCreate: true
    },
    {
      field: "confirmaSenha",
      type: "password",
      label: "Cofirme a Senha",
      grid: false,
      required: true,
      validator: ['', Validators.required],
      onlyCreate: true
    },
    {
      field: "celular",
      type: "text",
      label: "celular",
      grid: false,
      required: true,
      validator: ['', Validators.required],
      mask: "(00) 00000-0000",
      placeholder: "(99) 99999-9999"
    },
    {
      field: "situacao",
      type: "checkbox",
      label: "Situação",
      grid: true,
      required: true,
      validator: ['', Validators.required],
      filter: {
        type: "select"
      },
      isAdmin: true
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

  list(method: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(method);
  }


  public buscaPorId(id: number): Observable<any> {
    return this.http.get("usuario/" + id);
  }

  public cadastra(plano: Usuario) {
    if (plano.id) {
      return this.http
        .put('usuario', JSON.stringify(plano));
    }
    else {
      return this.http
        .post('usuario', JSON.stringify(plano));
    }
  }

  public redefinirSenha(senha: Senha) {
    return this.http
      .put('usuario/redefinir-senha', JSON.stringify(senha));
  }

  public redefinirSenhaAdmin(senha: Senha) {
    return this.http
      .put('usuario/redefinir-senha-admin', JSON.stringify(senha));
  }

  listaServicos(method: string): Observable<any[]> {
    return this.http.get<any[]>(method);
  }
}
