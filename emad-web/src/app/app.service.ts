import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AuthGuard } from './_core/_guards';
import { Observable, Subject } from "rxjs";
import { Menu } from './_core/_models/Menu';
import { Util } from './_core/_util/Util';
import { SocketService } from './_core/_services/socket.service';
import { ParametroSeguranca } from './_core/_models/ParametroSeguranca';

@Injectable()
export class AppService {
  http: Http;
  headers: Headers;
  url: string = Util.urlapi + '/menu/tipo-usuario';
  urlParametroSeguranca: string = Util.urlapi + '/parametro-seguranca/urls';
  public menus: any[];

  extrato: Subject<any>;

  constructor(http: Http, auth: AuthGuard, private socketService: SocketService) {

    this.http = http;
    this.headers = new Headers();
    this.headers.append('Content-type', 'application/json');
    this.headers.append('Authorization', auth.getToken());
  }

  list(): Observable<Menu[]> {
    return this.http.get(this.url, { headers: this.headers }).map(res => res.json());
  }

  listUrls(): Observable<ParametroSeguranca[]> {
    return this.http.get(this.urlParametroSeguranca, { headers: this.headers }).map(res => res.json());
  }
}