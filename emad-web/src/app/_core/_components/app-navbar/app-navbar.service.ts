import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AuthGuard } from '../../_guards';
import { Observable } from 'rxjs';
import { Util } from '../../_util/Util';

@Injectable()
export class AppNavbarService {
  visible: boolean;

  http : Http;
  headers : Headers;
  public menus : any[];

  constructor(http: Http, auth : AuthGuard){

    this.visible = false;
    this.http = http;
    this.headers = new Headers();
    this.headers.append('Content-type', 'application/json');
    this.headers.append('Authorization', auth.getToken());

  }
 

  hide() { this.visible = false; }
  show() { this.visible = true; }
  toggle() { this.visible = !this.visible; }


  list(method: String): Observable<any[]> {
    return this.http.get(Util.urlapi + '/' + method, { headers: this.headers }).map(res => res.json());
  }

}
