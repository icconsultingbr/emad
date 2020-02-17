import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { Http, Headers } from '@angular/http';
import { Util } from '../../_util/Util';
import { GenericsService } from '../../_services/generics.service';

@Injectable()
export class AppFormService extends GenericsService {

  http : Http; 
  headers : Headers;
  url : string = Util.urlapi+""; 


  inserir(obj: any, metodo: String){ 
    if(obj.id){
      return this.http
      .put(this.url+"/"+metodo, JSON.stringify(obj), { headers: this.headers })
      .map((res)=>res.json());
    }
    else{
      return this.http
      .post(this.url+"/"+metodo, JSON.stringify(obj), { headers: this.headers })
      .map((res)=>res.json());
    }
  }

  buscaPorId(id: string, metodo : String) : Observable<any>{
    return this.http.get(this.url+"/"+metodo+"/"+id, { headers: this.headers }).map(res => res.json());
  }

  remove(obj : any, metodo : String){
    return this.http.delete(this.url+'/'+metodo+"/"+obj.id, { headers: this.headers }).map(res => res.json());
  }

  list(method : String) : Observable<any[]>{
    return this.http.get(this.url+"/"+method, { headers: this.headers }).map(res => res.json());
  }

  
  findByName(method : String, query : String) : Observable<any>{
    return this.http.get(this.url+"/"+method+"?q="+query, { headers: this.headers }).map(res => res.json());
  }

}
