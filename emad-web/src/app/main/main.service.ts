import { Injectable } from '@angular/core';
import { GenericsService } from '../_core/_services/generics.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class MainService extends GenericsService {

  constructor(public http: HttpClient) {
    super(http);
  }

  carregaQtdAtendimentosPorPeriodo(periodo: number): Observable<any> {
    return this.http.get("atendimentos-quantidade?periodo="
      + periodo + "&idEstabelecimento="
      + JSON.parse(localStorage.getItem("est"))[0].id);
  }

  carregaAtendimentosPorPeriodo(periodo: number): Observable<any> {
    return this.http.get("atendimentos-por-periodo?periodo="
      + periodo + "&idEstabelecimento="
      + JSON.parse(localStorage.getItem("est"))[0].id);
  }

  carregaQtdMedicamentosPorPeriodo(periodo: number): Observable<any> {
    return this.http.get("medicamentos-quantidade?periodo="
      + periodo + "&idEstabelecimento="
      + JSON.parse(localStorage.getItem("est"))[0].id);
  }

  carregaMedicamentosPorPeriodo(periodo: number): Observable<any> {
    return this.http.get("medicamentos-por-periodo?periodo="
      + periodo + "&idEstabelecimento="
      + JSON.parse(localStorage.getItem("est"))[0].id);
  }

  carregaTipoAtendimentoExistentePorPeriodo(periodo: number): Observable<any> {
    return this.http.get("tipo-atendimento-existente-por-periodo?periodo="
      + periodo + "&idEstabelecimento="
      + JSON.parse(localStorage.getItem("est"))[0].id);
  }

  carregaTipoAtendimentoPorPeriodo(periodo: number): Observable<any> {
    return this.http.get("tipo-atendimento-por-periodo?periodo="
      + periodo + "&idEstabelecimento="
      + JSON.parse(localStorage.getItem("est"))[0].id);
  }

  carregaAtendimentoSituacaoExistentePorPeriodo(periodo: number): Observable<any> {
    return this.http.get("atendimento-situacao-existente-por-periodo?periodo="
      + periodo + "&idEstabelecimento="
      + JSON.parse(localStorage.getItem("est"))[0].id);
  }

  carregaAtendimentoSituacaoPorPeriodo(periodo: number): Observable<any> {
    return this.http.get("atendimento-situacao-por-periodo?periodo="
      + periodo + "&idEstabelecimento="
      + JSON.parse(localStorage.getItem("est"))[0].id);
  }
}
