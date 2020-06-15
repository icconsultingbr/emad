import { Component, OnInit } from '@angular/core';
import { AppNavbarService } from '../../../_core/_components/app-navbar/app-navbar.service';
import { TipoFichaService } from './tipo-ficha.service';
import { TipoFicha } from '../../../_core/_models/TipoFicha';

@Component({
    selector: 'app-tipo-ficha',
    templateUrl: './tipo-ficha.component.html',
    styleUrls: ['./tipo-ficha.component.css'],
    providers: [TipoFichaService]
})

export class TipoFichaComponent implements OnInit {

  method: string = "tipo-ficha";
  object: TipoFicha = new TipoFicha();
  fields: any[] = [];
  fieldsSearch: any[] = [];

  constructor(
    public nav: AppNavbarService,
    private service: TipoFichaService) {
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