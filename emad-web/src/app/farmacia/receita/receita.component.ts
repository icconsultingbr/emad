import { Component, OnInit } from '@angular/core';
import { AppNavbarService } from '../../_core/_components/app-navbar/app-navbar.service';
import { ReceitaService } from '../../shared/services/receita.service';
import { Receita } from '../../_core/_models/Receita';

@Component({
    selector: 'app-receita',
    templateUrl: './receita.component.html',
    styleUrls: ['./receita.component.css'],
    providers: [ReceitaService]
})

export class ReceitaComponent implements OnInit {

  method: String = "receita";
  object: Receita = new Receita();
  fields: any[] = [];
  fieldsSearch: any[] = [];

  constructor(
    public nav: AppNavbarService,
    private service: ReceitaService) {
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