import { Component, OnInit } from '@angular/core';
import { AppNavbarService } from '../../../_core/_components/app-navbar/app-navbar.service';
import { MetodoExameService } from './metodo-exame.service';
import { MetodoExame } from '../../../_core/_models/MetodoExame';

@Component({
    selector: 'app-metodo-exame',
    templateUrl: './metodo-exame.component.html',
    styleUrls: ['./metodo-exame.component.css'],
    providers: [MetodoExameService]
})

export class MetodoExameComponent implements OnInit {

  method: String = "metodo-exame";
  object: MetodoExame = new MetodoExame();
  fields: any[] = [];
  fieldsSearch: any[] = [];

  constructor(
    public nav: AppNavbarService,
    private service: MetodoExameService) {
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