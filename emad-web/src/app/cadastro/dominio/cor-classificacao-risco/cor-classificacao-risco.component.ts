import { Component, OnInit } from '@angular/core';
import { AppNavbarService } from '../../../_core/_components/app-navbar/app-navbar.service';
import { CorClassificacaoRiscoService } from './cor-classificacao-risco.service';
import { CorClassificacaoRisco } from '../../../_core/_models/CorClassificacaoRisco';

@Component({
    selector: 'app-cor-classificacao-risco',
    templateUrl: './cor-classificacao-risco.component.html',
    styleUrls: ['./cor-classificacao-risco.component.css'],
    providers: [CorClassificacaoRiscoService]
})

export class CorClassificacaoRiscoComponent implements OnInit {

  method: String = "cor-classificacao-risco";
  object: CorClassificacaoRisco = new CorClassificacaoRisco();
  fields: any[] = [];
  fieldsSearch: any[] = [];

  constructor(
    public nav: AppNavbarService,
    private service: CorClassificacaoRiscoService) {
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