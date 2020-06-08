import { Component, OnInit } from '@angular/core';
import { AppNavbarService } from '../../../_core/_components/app-navbar/app-navbar.service';
import { UnidadeMaterialService } from './unidade-material.service';
import { UnidadeMaterial } from '../../../_core/_models/UnidadeMaterial';

@Component({
    selector: 'app-unidade-material',
    templateUrl: './unidade-material.component.html',
    styleUrls: ['./unidade-material.component.css'],
    providers: [UnidadeMaterialService]
})

export class UnidadeMaterialComponent implements OnInit {

  method: String = "unidade-material";
  object: UnidadeMaterial = new UnidadeMaterial();
  fields: any[] = [];
  fieldsSearch: any[] = [];

  constructor(
    public nav: AppNavbarService,
    private service: UnidadeMaterialService) {
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