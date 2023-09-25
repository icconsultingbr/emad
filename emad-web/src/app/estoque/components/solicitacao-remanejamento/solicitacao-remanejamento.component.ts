import { Component, OnInit } from '@angular/core';
import { AppNavbarService } from '../../../_core/_components/app-navbar/app-navbar.service';
import { SolicitacaoRemanejamentoService } from './solicitacao-remanejamento.service';
import { SolicitacaoRemanejamento } from '../../../_core/_models/SolicitacaoRemanejamento';

@Component({
    selector: 'app-solicitacao-remanejamento',
    templateUrl: './solicitacao-remanejamento.component.html',
    styleUrls: ['./solicitacao-remanejamento.component.css'],
    providers: [SolicitacaoRemanejamentoService]
})

export class SolicitacaoRemanejamentoComponent implements OnInit {

  method: String = 'solicitacao-remanejamento/pendente';
  object: SolicitacaoRemanejamento = new SolicitacaoRemanejamento();
  fields: any[] = [];
  fieldsSearch: any[] = [];

  constructor(
    public nav: AppNavbarService,
    private service: SolicitacaoRemanejamentoService) {
    for (const field of this.service.fields) {
      if (field.grid) {
        this.fields.push(field);
      }
      if (field.filter) {
        this.fieldsSearch.push(field);
      }
    }
  }

  ngOnInit() {
    this.nav.show();
  }
}
