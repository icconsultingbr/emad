import { Injectable } from '@angular/core';
import { GenericsService } from '../../../_core/_services/generics.service';
import { Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AjusteEstoqueService extends GenericsService {

  constructor(public http: HttpClient) {
    super(http);
  }

  inserirMaterialEstoque(obj: any, metodo: string) {
    return this.http.post(metodo, JSON.stringify(obj));
  }
}
