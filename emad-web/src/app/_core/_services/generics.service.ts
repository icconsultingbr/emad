import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export abstract class GenericsService {

  constructor(public http: HttpClient) {
    this.http = http;
  }

  list(method: string): Observable<any> {
    return this.http.get(method);
  }

  listDomains(method: string): Observable<any> {
    return this.http.get('dominios/' + method);
  }

  findById(id: any, method: string): Observable<any> {
    return this.http.get(method + '/' + id);
  }

  save(obj: any, method: string) {
    if (obj.id) {
      return this.http
        .put(method, JSON.stringify(obj));
    } else {
      return this.http
        .post(method, JSON.stringify(obj));
    }
  }

  remove(params: any, method: string) {
    return this.http.delete(method + '/' + params);
  }


  listServices(method: string): Observable<any[]> {
    return this.http.get<any[]>(method);
  }

  sendReport(obj: any) {
    return this.http
      .post('reports', JSON.stringify(obj));
  }

  file(url: any, uri: any): Observable<any> {
    const object: any = {};
    object.url = uri;
    return this.http.post(url, JSON.stringify(object));
  }
}
