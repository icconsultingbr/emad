import { Component, OnInit } from '@angular/core';
import { AppNavbarService } from '../../../_core/_components/app-navbar/app-navbar.service';
import { TipoUnidadeService } from './tipo-unidade.service';
import { TipoUnidade } from '../../../_core/_models/TipoUnidade';

@Component({
    selector: 'app-tipo-unidade',
    templateUrl: './tipo-unidade.component.html',
    styleUrls: ['./tipo-unidade.component.css'],
    providers: [TipoUnidadeService]
})

export class TipoUnidadeComponent implements OnInit {

  method: String = "tipo-unidade";
  object: TipoUnidade = new TipoUnidade();
  fields: any[] = [];
  fieldsSearch: any[] = [];

  constructor(
    public nav: AppNavbarService,
    private service: TipoUnidadeService) {
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