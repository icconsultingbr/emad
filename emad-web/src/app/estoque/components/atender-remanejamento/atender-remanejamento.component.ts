import { Component, OnInit } from '@angular/core';
import { AppNavbarService } from '../../../_core/_components/app-navbar/app-navbar.service';

import { SolicitacaoRemanejamento } from '../../../_core/_models/SolicitacaoRemanejamento';
import { SolicitacaoRemanejamentoService } from '../solicitacao-remanejamento/solicitacao-remanejamento.service';

@Component({
    selector: 'app-atender-remanejamento',
    templateUrl: './atender-remanejamento.component.html',
    styleUrls: ['./atender-remanejamento.component.css'],
    providers: [SolicitacaoRemanejamentoService]
})

export class AtenderRemanejamentoComponent implements OnInit {

  method: String = "solicitacao-remanejamento/atender";
  object: SolicitacaoRemanejamento = new SolicitacaoRemanejamento();
  fields: any[] = [];
  fieldsSearch: any[] = [];

  constructor(
    public nav: AppNavbarService,
    private service: SolicitacaoRemanejamentoService) {
    for (let field of this.service.fields) {
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