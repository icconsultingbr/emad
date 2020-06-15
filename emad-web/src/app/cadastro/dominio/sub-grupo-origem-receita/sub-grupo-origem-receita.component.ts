import { Component, OnInit } from '@angular/core';
import { AppNavbarService } from '../../../_core/_components/app-navbar/app-navbar.service';
import { SubGrupoOrigemReceitaService } from './sub-grupo-origem-receita.service';
import { SubGrupoOrigemReceita } from '../../../_core/_models/SubGrupoOrigemReceita';

@Component({
    selector: 'app-sub-grupo-origem-receita',
    templateUrl: './sub-grupo-origem-receita.component.html',
    styleUrls: ['./sub-grupo-origem-receita.component.css'],
    providers: [SubGrupoOrigemReceitaService]
})

export class SubGrupoOrigemReceitaComponent implements OnInit {

  method: string = "sub-grupo-origem-receita";
  object: SubGrupoOrigemReceita = new SubGrupoOrigemReceita();
  fields: any[] = [];
  fieldsSearch: any[] = [];

  constructor(
    public nav: AppNavbarService,
    private service: SubGrupoOrigemReceitaService) {
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