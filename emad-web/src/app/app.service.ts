import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { AuthGuard } from './_core/_guards';
import { Observable, Subject } from "rxjs";
import { Menu } from './_core/_models/Menu';
import { ParametroSeguranca } from './_core/_models/ParametroSeguranca';
import { HttpClient } from '@angular/common/http';
import { Especialidade } from './_core/_models/Especialidade';

@Injectable()
export class AppService {
  http: HttpClient;
  headers: Headers;
  url: string = 'menu/tipo-usuario';
  urlParametroSeguranca: string = 'parametro-seguranca/urls';
  urlEspecialidade: string = 'especialidade/profissional';
  public menus: any[];

  extrato: Subject<any>;

  constructor(http: HttpClient, auth: AuthGuard) {

    this.http = http;
    this.headers = new Headers();
    this.headers.append('Content-type', 'application/json');
    this.headers.append('Authorization', auth.getToken());
  }

  list(): Observable<Menu[]> {
    return this.http.get<Menu[]>(this.url);
  }

  listUrls(): Observable<ParametroSeguranca[]> {
    return this.http.get<ParametroSeguranca[]>(this.urlParametroSeguranca);
  }

  listEspecialidade(): Observable<Especialidade> {
    return this.http.get<Especialidade>(this.urlEspecialidade);
  }
}