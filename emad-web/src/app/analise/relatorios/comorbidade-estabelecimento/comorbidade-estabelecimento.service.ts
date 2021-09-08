import { Injectable } from '@angular/core';
import { GenericsService } from '../../../_core/_services/generics.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ComorbidadeEstabelecimentoService extends GenericsService {

    constructor(public http: HttpClient) {
        super(http);
    }

    imprimir(idEstabelecimento: number): Observable<any> {
        return this.http.get("comorbidade-estabelecimento/estabelecimento/" + idEstabelecimento);
    }

}
