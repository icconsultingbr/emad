import { Injectable } from '@angular/core';
import { GenericsService } from '../_core/_services/generics.service';
import { Observable } from 'rxjs';
import { Validators } from '@angular/forms';

@Injectable()
export class MainService extends GenericsService{
  
    carregaQtdAtendimentosPorPeriodo(periodo: number): Observable<any> {
        return this.http.get(this.url + "atendimentos-quantidade?periodo=" 
        + periodo + "&idEstabelecimento="
        + JSON.parse(localStorage.getItem("est"))[0].id,
        { headers: this.headers }).map(res => res.json());
    }

    carregaAtendimentosPorPeriodo(periodo: number): Observable<any> {
      return this.http.get(this.url + "atendimentos-por-periodo?periodo=" 
      + periodo + "&idEstabelecimento="
      + JSON.parse(localStorage.getItem("est"))[0].id,
      { headers: this.headers }).map(res => res.json());
    }

    carregaQtdMedicamentosPorPeriodo(periodo: number): Observable<any> {
      return this.http.get(this.url + "medicamentos-quantidade?periodo=" 
      + periodo + "&idEstabelecimento="
      + JSON.parse(localStorage.getItem("est"))[0].id,
      { headers: this.headers }).map(res => res.json());
    }

    carregaMedicamentosPorPeriodo(periodo: number): Observable<any> {
      return this.http.get(this.url + "medicamentos-por-periodo?periodo=" 
      + periodo + "&idEstabelecimento="
      + JSON.parse(localStorage.getItem("est"))[0].id,
      { headers: this.headers }).map(res => res.json());
    }

    carregaTipoAtendimentoExistentePorPeriodo(periodo: number): Observable<any> {
      return this.http.get(this.url + "tipo-atendimento-existente-por-periodo?periodo=" 
      + periodo + "&idEstabelecimento="
      + JSON.parse(localStorage.getItem("est"))[0].id,
      { headers: this.headers }).map(res => res.json());
    }  

    carregaTipoAtendimentoPorPeriodo(periodo: number): Observable<any> {
      return this.http.get(this.url + "tipo-atendimento-por-periodo?periodo=" 
      + periodo + "&idEstabelecimento="
      + JSON.parse(localStorage.getItem("est"))[0].id,
      { headers: this.headers }).map(res => res.json());
    }    
}
