import { Component, OnInit } from '@angular/core';
import { AppNavbarService } from '../../../_core/_components/app-navbar/app-navbar.service';
import { TipoMovimentoService } from './tipo-movimento.service';
import { TipoMovimento } from '../../../_core/_models/TipoMovimento';

@Component({
    selector: 'app-tipo-movimento',
    templateUrl: './tipo-movimento.component.html',
    styleUrls: ['./tipo-movimento.component.css'],
    providers: [TipoMovimentoService]
})

export class TipoMovimentoComponent implements OnInit {

  method: string = "tipo-movimento";
  object: TipoMovimento = new TipoMovimento();
  fields: any[] = [];
  fieldsSearch: any[] = [];

  constructor(
    public nav: AppNavbarService,
    private service: TipoMovimentoService) {
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