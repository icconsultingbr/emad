import { Injectable } from "@angular/core";
import { LoginComponent } from "./login.component";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class LoginService {

  http: HttpClient;
  url: string = 'usuario/login';
  urlValidaToken: string = 'usuario/validaToken';
  urlRecuperarSenha: string = 'usuario/recuperar-senha';

  constructor(http: HttpClient, private router: Router) {
    this.http = http;
  }

  login(login: LoginComponent) {
    return this.http.post(this.url, JSON.stringify(login));
  }

  validaToken(): Promise<any> {
    return this.http.get(this.urlValidaToken)
      .toPromise()
      .then((r: any) => {
        if (!r.success) {
          this.logout();
          this.router.navigate(['/login']);
        }
      })
      .catch(() => {
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
    return this.http.post(this.urlRecuperarSenha, JSON.stringify(login));
  }
}