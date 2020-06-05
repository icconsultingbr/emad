import { Component, OnInit } from '@angular/core';
import { AppNavbarService } from '../../../_core/_components/app-navbar/app-navbar.service';
import { TipoMaterialService } from './tipo-material.service';
import { TipoMaterial } from '../../../_core/_models/TipoMaterial';

@Component({
    selector: 'app-tipo-material',
    templateUrl: './tipo-material.component.html',
    styleUrls: ['./tipo-material.component.css'],
    providers: [TipoMaterialService]
})

export class TipoMaterialComponent implements OnInit {

  method: String = "tipo-material";
  object: TipoMaterial = new TipoMaterial();
  fields: any[] = [];
  fieldsSearch: any[] = [];

  constructor(
    public nav: AppNavbarService,
    private service: TipoMaterialService) {
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