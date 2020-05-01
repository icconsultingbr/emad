import { Injectable } from '@angular/core';
import { GenericsService } from '../../_core/_services/generics.service';
import { Observable } from 'rxjs';

@Injectable()
export class AtribuicaoCanetaService extends GenericsService{
  
    fields: any[] = [
        
      ];

      findHistoricoAtribuicaoByProfissional(id: any): Observable<any> {
        return this.http.get(this.url + "atribuicao-caneta/profissional/" + id, { headers: this.headers }).map(res => res.json());
    }

    saveAtribuicao(obj: any) {
      if (obj.id) {
          return this.http
              .put(this.url + 'atribuicao-caneta', JSON.stringify(obj), { headers: this.headers })
              .map((res) => res.json());
      }
      else {
          return this.http
              .post(this.url + 'atribuicao-caneta', JSON.stringify(obj), { headers: this.headers })
              .map((res) => res.json());
      }
  }

  removeAtribuicao(params: any) {
    return this.http.delete(this.url + 'atribuicao-caneta/' + params, { headers: this.headers }).map(res => res.json());
}

}
