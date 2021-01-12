import { Injectable } from '@angular/core';
import { GenericsService } from '../../_core/_services/generics.service';
import { Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IntegracaoEsusModel } from '../../_core/_models/IntegracaoEsus';

@Injectable()
export class IntegracaoEsus extends GenericsService {

  constructor(public http: HttpClient) {
    super(http);
  }
  obterXmlsPorTipoFicha(filtroXmls: IntegracaoEsusModel): Observable <ArrayBuffer> {
    return this.http.post('integracao-e-sus', filtroXmls, {​​ responseType: 'arraybuffer'}​​)
  }
}

