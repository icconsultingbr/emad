import { Component, OnInit } from '@angular/core';
import { AppNavbarService } from '../../../_core/_components/app-navbar/app-navbar.service';
import { ClassificacaoRiscoService } from './classificacao-risco.service';
import { ClassificacaoRisco } from '../../../_core/_models/ClassificacaoRisco';

@Component({
    selector: 'app-classificacao-risco',
    templateUrl: './classificacao-risco.component.html',
    styleUrls: ['./classificacao-risco.component.css'],
    providers: [ClassificacaoRiscoService]
})

export class ClassificacaoRiscoComponent implements OnInit {

  method: string = "classificacao-risco";
  object: ClassificacaoRisco = new ClassificacaoRisco();
  fields: any[] = [];
  fieldsSearch: any[] = [];

  constructor(
    public nav: AppNavbarService,
    private service: ClassificacaoRiscoService) {
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