import { Component, OnInit } from '@angular/core';
import { AppNavbarService } from '../../_core/_components/app-navbar/app-navbar.service';
import { EstabelecimentoGrupoMaterialService } from './estabelecimento-grupo-material.service';
import { EstabelecimentoGrupoMaterial } from '../../_core/_models/EstabelecimentoGrupoMaterial';

@Component({
    selector: 'app-estabelecimento-grupo-material',
    templateUrl: './estabelecimento-grupo-material.component.html',
    styleUrls: ['./estabelecimento-grupo-material.component.css'],
    providers: [EstabelecimentoGrupoMaterialService]
})

export class EstabelecimentoGrupoMaterialComponent implements OnInit {

  method = 'estabelecimento-grupo-material';
  object: EstabelecimentoGrupoMaterial = new EstabelecimentoGrupoMaterial();
  fields: any[] = [];
  fieldsSearch: any[] = [];

  constructor(
    public nav: AppNavbarService,
    private service: EstabelecimentoGrupoMaterialService) {
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
