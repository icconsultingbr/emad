import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericsService } from '../../_services/generics.service';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AppFormService extends GenericsService {

  constructor(public http: HttpClient) {
    super(http);
  }

  inserir(obj: any, metodo: string) {
    if (obj.id) {
      return this.http
      .put(metodo, JSON.stringify(obj));
    } else {
      return this.http
      .post(metodo, JSON.stringify(obj));
    }
  }

  buscaPorId(id: string, metodo: string): Observable<any> {
    return this.http.get(metodo + '/' + id);
  }

  remove(obj: any, metodo: string) {
    return this.http.delete(metodo + '/' + obj.id);
  }

  list(method: string): Observable<any[]> {
    return this.http.get<any[]>(method);
  }


  findByName(method: string, query: string): Observable<any> {
    return this.http.get(method + '?q=' + query);
  }

}
