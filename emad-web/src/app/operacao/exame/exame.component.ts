import { Component, OnInit } from '@angular/core';
import { AppNavbarService } from '../../_core/_components/app-navbar/app-navbar.service';
import { ExameService } from '../../shared/services/exame.service';
import { Exame } from '../../_core/_models/Exame';

@Component({
    selector: 'app-exame',
    templateUrl: './exame.component.html',
    styleUrls: ['./exame.component.css'],
    providers: [ExameService]
})

export class ExameComponent implements OnInit {

  method: String = 'exame';
  object: Exame = new Exame();
  fields: any[] = [];
  fieldsSearch: any[] = [];

  constructor(
    public nav: AppNavbarService,
    private service: ExameService) {
    for (const field of this.service.fields) {
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
