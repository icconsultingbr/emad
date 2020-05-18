import { Injectable } from '@angular/core';
import { Util } from '../../_core/_util/Util';
import { Http, Headers } from '@angular/http';
import { Validators } from '@angular/forms';
import { AuthGuard } from '../../_core/_guards';
import { Observable } from "rxjs";
import { Menu } from '../../_core/_models/Menu';

@Injectable()
export class MenuService {

  http : Http; 
  headers : Headers;


  fields : any[] = [
    {field:"id", type:"hidden", label:"Id", grid:false, form:true, required:false, validator:['', '']},
    {field:"nome", type:"text", label:"Nome", grid:true,  form:true,  required:true, validator:['', Validators.required]},
    {
      field:"menuPai", 
      type:"select", 
      label:"Menu Pai", 
      grid:true, 
      form:true,  
      required:false, 
      validator:['', ''],
      filter: {
        type: "select",
        changeMethod: 'menu/ordem-menu-filho',
        changeTarget: 'ordem'
      }, 
  
  },
    {field:"icone", type:"text", label:"Ícone", grid:false, form:true,  required:false, validator:['', '']},
    {field:"rota", type:"text", label:"Rota", grid:true, form:true,  required:true, validator:['', Validators.required]},
    {field:"ordem", type:"select", label:"Ordem", grid:false, form:true,  required:true, validator:['1', Validators.required]},
    {field:"situacao", type:"checkbox", label:"Situação", form:true, grid:true,  required:true, validator:['', '']},
  ]; 
 
  constructor(http: Http, auth : AuthGuard){

    this.http = http;
    this.headers = new Headers();
    this.headers.append('Content-type', 'application/json');
    this.headers.append('Authorization', auth.getToken());

  }

  list(method : String) : Observable<Menu[]>{
    return this.http.get(Util.urlapi+'/'+method, { headers: this.headers }).map(res => res.json());
  }

  listOrdem(method: String): Observable<any> {
    return this.http.get(Util.urlapi+'/'+method, { headers: this.headers }).map(res => res.json());
  }
}
