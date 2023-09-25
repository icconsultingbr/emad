import { Component, OnInit } from '@angular/core';
import { AppNavbarService } from '../../_core/_components/app-navbar/app-navbar.service';
import { FabricanteMaterialService } from './fabricante-material.service';
import { FabricanteMaterial } from '../../_core/_models/FabricanteMaterial';

@Component({
    selector: 'app-fabricante-material',
    templateUrl: './fabricante-material.component.html',
    styleUrls: ['./fabricante-material.component.css'],
    providers: [FabricanteMaterialService]
})

export class FabricanteMaterialComponent implements OnInit {

  method = 'fabricante-material';
  object: FabricanteMaterial = new FabricanteMaterial();
  fields: any[] = [];
  fieldsSearch: any[] = [];

  constructor(
    public nav: AppNavbarService,
    private service: FabricanteMaterialService) {
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
