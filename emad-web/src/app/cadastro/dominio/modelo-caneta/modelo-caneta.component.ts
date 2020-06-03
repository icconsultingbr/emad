import { Component, OnInit } from '@angular/core';
import { AppNavbarService } from '../../../_core/_components/app-navbar/app-navbar.service';
import { ModeloCanetaService } from './modelo-caneta.service';
import { ModeloCaneta } from '../../../_core/_models/ModeloCaneta';

@Component({
    selector: 'app-modelo-caneta',
    templateUrl: './modelo-caneta.component.html',
    styleUrls: ['./modelo-caneta.component.css'],
    providers: [ModeloCanetaService]
})

export class ModeloCanetaComponent implements OnInit {

  method: String = "modelo-caneta";
  object: ModeloCaneta = new ModeloCaneta();
  fields: any[] = [];
  fieldsSearch: any[] = [];

  constructor(
    public nav: AppNavbarService,
    private service: ModeloCanetaService) {
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