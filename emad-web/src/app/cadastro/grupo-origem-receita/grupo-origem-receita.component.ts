import { Component, OnInit } from '@angular/core';
import { AppNavbarService } from '../../_core/_components/app-navbar/app-navbar.service';
import { GrupoOrigemReceitaService } from './grupo-origem-receita.service';
import { GrupoOrigemReceita } from '../../_core/_models/GrupoOrigemReceita';

@Component({
    selector: 'app-grupo-origem-receita',
    templateUrl: './grupo-origem-receita.component.html',
    styleUrls: ['./grupo-origem-receita.component.css'],
    providers: [GrupoOrigemReceitaService]
})

export class GrupoOrigemReceitaComponent implements OnInit {

  method: string = "grupo-origem-receita";
  object: GrupoOrigemReceita = new GrupoOrigemReceita();
  fields: any[] = [];
  fieldsSearch: any[] = [];

  constructor(
    public nav: AppNavbarService,
    private service: GrupoOrigemReceitaService) {
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