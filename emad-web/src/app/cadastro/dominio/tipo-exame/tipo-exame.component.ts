import { Component, OnInit } from '@angular/core';
import { AppNavbarService } from '../../../_core/_components/app-navbar/app-navbar.service';
import { TipoExameService } from './tipo-exame.service';
import { TipoExame } from '../../../_core/_models/TipoExame';

@Component({
    selector: 'app-tipo-exame',
    templateUrl: './tipo-exame.component.html',
    styleUrls: ['./tipo-exame.component.css'],
    providers: [TipoExameService]
})

export class TipoExameComponent implements OnInit {

  method: String = "tipo-exame";
  object: TipoExame = new TipoExame();
  fields: any[] = [];
  fieldsSearch: any[] = [];

  constructor(
    public nav: AppNavbarService,
    private service: TipoExameService) {
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