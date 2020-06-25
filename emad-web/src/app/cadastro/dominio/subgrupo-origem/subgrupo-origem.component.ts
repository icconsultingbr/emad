import { Component, OnInit } from '@angular/core';
import { AppNavbarService } from '../../../_core/_components/app-navbar/app-navbar.service';
import { SubgrupoOrigemService } from './subgrupo-origem.service';
import { SubgrupoOrigem } from '../../../_core/_models/SubgrupoOrigem';

@Component({
    selector: 'app-subgrupo-origem',
    templateUrl: './subgrupo-origem.component.html',
    styleUrls: ['./subgrupo-origem.component.css'],
    providers: [SubgrupoOrigemService]
})

export class SubgrupoOrigemComponent implements OnInit {

  method: String = "subgrupo-origem";
  object: SubgrupoOrigem = new SubgrupoOrigem();
  fields: any[] = [];
  fieldsSearch: any[] = [];

  constructor(
    public nav: AppNavbarService,
    private service: SubgrupoOrigemService) {
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