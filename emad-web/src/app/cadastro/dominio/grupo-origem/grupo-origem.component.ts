import { Component, OnInit } from '@angular/core';
import { AppNavbarService } from '../../../_core/_components/app-navbar/app-navbar.service';
import { GrupoOrigemService } from './grupo-origem.service';
import { GrupoOrigem } from '../../../_core/_models/GrupoOrigem';

@Component({
    selector: 'app-grupo-origem',
    templateUrl: './grupo-origem.component.html',
    styleUrls: ['./grupo-origem.component.css'],
    providers: [GrupoOrigemService]
})

export class GrupoOrigemComponent implements OnInit {

  method: String = 'grupo-origem';
  object: GrupoOrigem = new GrupoOrigem();
  fields: any[] = [];
  fieldsSearch: any[] = [];

  constructor(
    public nav: AppNavbarService,
    private service: GrupoOrigemService) {
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
