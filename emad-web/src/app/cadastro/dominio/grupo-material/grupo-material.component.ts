import { Component, OnInit } from '@angular/core';
import { AppNavbarService } from '../../../_core/_components/app-navbar/app-navbar.service';
import { GrupoMaterialService } from './grupo-material.service';
import { GrupoMaterial } from '../../../_core/_models/GrupoMaterial';

@Component({
    selector: 'app-grupo-material',
    templateUrl: './grupo-material.component.html',
    styleUrls: ['./grupo-material.component.css'],
    providers: [GrupoMaterialService]
})

export class GrupoMaterialComponent implements OnInit {

  method = 'grupo-material';
  object: GrupoMaterial = new GrupoMaterial();
  fields: any[] = [];
  fieldsSearch: any[] = [];

  constructor(
    public nav: AppNavbarService,
    private service: GrupoMaterialService) {
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
