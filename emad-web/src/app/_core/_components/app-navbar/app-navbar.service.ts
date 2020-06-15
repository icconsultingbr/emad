import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AuthGuard } from '../../_guards';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AppNavbarService {
  visible: boolean;

  http: HttpClient;
  headers: Headers;
  public menus: any[];

  constructor(http: HttpClient) {

    this.visible = false;
    this.http = http;
  }


  hide() { this.visible = false; }
  show() { this.visible = true; }
  toggle() { this.visible = !this.visible; }


  list(method: string): Observable<any[]> {
    return this.http.get<any[]>(method);
  }

  findById(id: any, method: string): Observable<any> {
    return this.http.get(method + "/" + id);
  }
  
  notificacaoVisualizada(obj: any) {
    return this.http.put('notificacao/visualizada/'+ obj.id, JSON.stringify(obj));            
  }
}
