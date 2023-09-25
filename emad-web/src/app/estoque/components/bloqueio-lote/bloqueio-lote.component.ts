import { Component, OnInit } from '@angular/core';
import { AppNavbarService } from '../../../_core/_components/app-navbar/app-navbar.service';
import { BloqueioLoteService } from './bloqueio-lote.service';
import { Estoque } from '../../../_core/_models/Estoque';

@Component({
    selector: 'app-bloqueio-lote',
    templateUrl: './bloqueio-lote.component.html',
    styleUrls: ['./bloqueio-lote.component.css'],
    providers: [BloqueioLoteService]
})

export class BloqueioLoteComponent implements OnInit {

  method: String = 'estoque-bloqueados';
  object: Estoque = new Estoque();
  fields: any[] = [];
  fieldsSearch: any[] = [];

  constructor(
    public nav: AppNavbarService,
    private service: BloqueioLoteService) {
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
