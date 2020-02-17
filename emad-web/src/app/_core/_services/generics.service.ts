import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Util } from '../_util/Util';
import { AuthGuard } from '../_guards';
import { Observable } from 'rxjs';

@Injectable()
export class GenericsService {

  public http: Http;
  public headers: Headers;
  public auth: AuthGuard;
  public url: string = Util.urlapi + '/';

  constructor(http: Http, auth: AuthGuard) {
    this.auth = auth;
    this.http = http;
    this.headers = new Headers();

    this.headers.append('Content-type', 'application/json');
    this.headers.append('Authorization', this.auth.getToken());
  }

  list(method: String): Observable<any> {
    this.loadHeaders();
    return this.http.get(this.url + method, { headers: this.headers }).map(res => res.json());
  }

  listDomains(method): Observable<any> {
    this.loadHeaders();
    return this.http.get(Util.urlapi.toString() + '/dominios/' + method, { headers: this.headers }).map(res => res.json());
  }

  findById(id: any, method: String): Observable<any> {
    this.loadHeaders();
    return this.http.get(this.url + method + "/" + id, { headers: this.headers }).map(res => res.json());
  }

  save(obj: any, method: String) {
    this.loadHeaders();
    if (obj.id) {
      return this.http
        .put(this.url + method, JSON.stringify(obj), { headers: this.headers })
        .map((res) => res.json());
    }
    else {
      return this.http
        .post(this.url + method, JSON.stringify(obj), { headers: this.headers })
        .map((res) => res.json());
    }
  }

  remove(params: any, method: String) {
    this.loadHeaders();
    return this.http.delete(this.url + "" + method + '/' + params, { headers: this.headers }).map(res => res.json());
  }


  listServices(method: String): Observable<any[]> {
    this.loadHeaders();
    return this.http.get(Util.urlapi + '/' + method, { headers: this.headers }).map(res => res.json());
  }

  sendReport(obj: any) {
    this.loadHeaders();
    return this.http
      .post(Util.urlapi + '/reports', JSON.stringify(obj), { headers: this.headers })
      .map((res) => res.json());
  }

  loadHeaders() {
    if (localStorage.getItem("est")) {
      this.headers.delete("est");
      this.headers.append('est', JSON.parse(localStorage.getItem("est"))[0].id);
    }
  }

 

  file(url : any, uri: any): Observable<any> {

    let object: any = {};
    object.url = uri;
    return this.http.post(Util.urlapi + '/' + url , JSON.stringify(object), { headers: this.headers }).map(res => res.json());
  }
}


