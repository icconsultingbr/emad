import { Injectable } from '@angular/core';
import { GenericsService } from '../../_core/_services/generics.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class RelatoriosEstoqueService extends GenericsService {

  constructor(public http: HttpClient) {
    super(http);
  }

  obterRelatorioEntradaMaterial(idMovimentoGeral: number): Observable<any>{ 
    return this.http.get("estoque" + "/movimento-geral/" + idMovimentoGeral + "/relatorio");
  }  
}

