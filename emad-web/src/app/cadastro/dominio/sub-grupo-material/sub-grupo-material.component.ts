import { Component, OnInit } from '@angular/core';
import { AppNavbarService } from '../../../_core/_components/app-navbar/app-navbar.service';
import { SubGrupoMaterialService } from './sub-grupo-material.service';
import { SubGrupoMaterial } from '../../../_core/_models/SubGrupoMaterial';

@Component({
    selector: 'app-sub-grupo-material',
    templateUrl: './sub-grupo-material.component.html',
    styleUrls: ['./sub-grupo-material.component.css'],
    providers: [SubGrupoMaterialService]
})

export class SubGrupoMaterialComponent implements OnInit {

  method: string = "sub-grupo-material";
  object: SubGrupoMaterial = new SubGrupoMaterial();
  fields: any[] = [];
  fieldsSearch: any[] = [];

  constructor(
    public nav: AppNavbarService,
    private service: SubGrupoMaterialService) {
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