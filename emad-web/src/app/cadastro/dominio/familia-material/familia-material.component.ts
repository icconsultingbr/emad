import { Component, OnInit } from '@angular/core';
import { AppNavbarService } from '../../../_core/_components/app-navbar/app-navbar.service';
import { FamiliaMaterialService } from './familia-material.service';
import { FamiliaMaterial } from '../../../_core/_models/FamiliaMaterial';

@Component({
    selector: 'app-familia-material',
    templateUrl: './familia-material.component.html',
    styleUrls: ['./familia-material.component.css'],
    providers: [FamiliaMaterialService]
})

export class FamiliaMaterialComponent implements OnInit {

  method: string = "familia-material";
  object: FamiliaMaterial = new FamiliaMaterial();
  fields: any[] = [];
  fieldsSearch: any[] = [];

  constructor(
    public nav: AppNavbarService,
    private service: FamiliaMaterialService) {
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