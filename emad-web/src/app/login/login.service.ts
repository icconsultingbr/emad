import { Http, Headers, Response } from "@angular/http";
import { Injectable } from "@angular/core";
import { LoginComponent } from "./login.component";
import { Util } from "../_core/_util/Util";
import { Router } from "@angular/router";


@Injectable()
export class LoginService {

  http: Http;
  headers: Headers;
  url: string = Util.urlapi + '/usuario/login';
  urlValidaToken: string = Util.urlapi + '/usuario/validaToken';
  urlRecuperarSenha : string = Util.urlapi + '/usuario/recuperar-senha';

  constructor(http: Http, private router: Router) {
    this.http = http;
    this.headers = new Headers();
    this.headers.append('Content-type', 'application/json');
  } 

  login(login: LoginComponent) {
    return this.http.post(this.url, JSON.stringify(login), { headers: this.headers })
      .map((res) => res.json());
  }

  validaToken(): Promise<any> {
    let user = JSON.parse(localStorage.getItem('currentUser'));
    let headers = new Headers();
    headers.append('Content-type', 'application/json');
    headers.append('Authorization', user.token);
    return this.http.get(this.urlValidaToken, { headers: headers })
      .toPromise()
      .then((r: any) => {
        if (r.status != '200') {
          this.logout();
          this.router.navigate(['/login']);
        }
      })
      .catch((err: Error) => {
        this.logout();
        this.router.navigate(['/login']);
      });
  }

  logout(): void {
    // clear token remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('menu');
    localStorage.removeItem('est');
  }

  recuperarSenha(login) {
    return this.http.post(this.urlRecuperarSenha, JSON.stringify(login), { headers: this.headers })
      .map((res) => res.json());
  }

}
