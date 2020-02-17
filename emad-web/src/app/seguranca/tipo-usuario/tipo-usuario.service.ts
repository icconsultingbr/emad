import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AuthGuard } from '../../_core/_guards';
import { Observable } from 'rxjs';
import { TipoUsuario } from '../../_core/_models/TipoUsuario';
import { Util } from '../../_core/_util/Util';
import { Validators } from '@angular/forms';
import { Menu } from '../../_core/_models/Menu';
import { GenericsService } from '../../_core/_services/generics.service';

@Injectable()
export class TipoUsuarioService extends GenericsService {

  public http: Http;
  public headers : Headers;
  url: string = Util.urlapi + '/tipo-usuario';

  fields: any[] = [
    {
      field: "id",
      type: "hidden",
      label: "Id",
      grid: false,
      form: true,
      required: false,
      validator: ['', '']
    }, 
    {
      field: "nome",
      type: "text",
      label: "Nome",
      grid: true,
      form: true,
      required: true,
      validator: ['', Validators.required],
      autoFocus : true
    },
    {
      field: "periodoSenha",
      type: "text",
      label: "Período de troca da senha (dias)",
      grid: true,
      form: true,
      required: true,
      validator: ['', Validators.required],
      autoFocus : true
    }  
  ];

  buscaPorId(id: string) : Observable<TipoUsuario>{
    return this.http.get(this.url+"/"+id, { headers: this.headers }).map(res => res.json());
  }

  cadastra(tipoUsuario: TipoUsuario){ 
    if(tipoUsuario.id){
      return this.http
      .put(this.url, JSON.stringify(tipoUsuario), { headers: this.headers })
      .map((res)=>res.json());
    } 
    else{
      return this.http
      .post(this.url, JSON.stringify(tipoUsuario), { headers: this.headers })
      .map((res)=>res.json());
    }
  } 

  remove(mensagem : any){
    return this.http.delete(this.url+'/'+mensagem.id, { headers: this.headers }).map(res => res.json());
  }

  listMenuTipoUsuario(id : Number) : Observable<Menu[]>{
    return this.http.get(Util.urlapi+'/menu/tipo-usuario/descricao/'+id, { headers: this.headers }).map(res => res.json());
  }

  listMenu() : Observable<Menu[]>{
    return this.http.get(Util.urlapi+'/menu/descricao', { headers: this.headers }).map(res => res.json()); 
  }


}
 