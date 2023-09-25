import { Component, OnInit } from '@angular/core';
import { AppNavbarService } from '../../../_core/_components/app-navbar/app-navbar.service';
import { ProdutoExameService } from './produto-exame.service';
import { ProdutoExame } from '../../../_core/_models/ProdutoExame';

@Component({
    selector: 'app-produto-exame',
    templateUrl: './produto-exame.component.html',
    styleUrls: ['./produto-exame.component.css'],
    providers: [ProdutoExameService]
})

export class ProdutoExameComponent implements OnInit {

  method: String = 'produto-exame';
  object: ProdutoExame = new ProdutoExame();
  fields: any[] = [];
  fieldsSearch: any[] = [];

  constructor(
    public nav: AppNavbarService,
    private service: ProdutoExameService) {
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
