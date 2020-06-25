import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { GenericsService } from '../../_core/_services/generics.service';

@Injectable()
export class PesquisaPacienteService extends GenericsService {

  constructor(public http: HttpClient) {
    super(http);
  }

  

  list(method : string) : Observable<any[]>{
    return this.http.get<any[]>(method);
  }
}
