import { Component, OnInit } from '@angular/core';
import { AppNavbarService } from '../../../_core/_components/app-navbar/app-navbar.service';
import { ListaControleEspecialService } from './lista-controle-especial.service';
import { ListaControleEspecial } from '../../../_core/_models/ListaControleEspecial';

@Component({
    selector: 'app-lista-controle-especial',
    templateUrl: './lista-controle-especial.component.html',
    styleUrls: ['./lista-controle-especial.component.css'],
    providers: [ListaControleEspecialService]
})

export class ListaControleEspecialComponent implements OnInit {

  method: string = "lista-controle-especial";
  object: ListaControleEspecial = new ListaControleEspecial();
  fields: any[] = [];
  fieldsSearch: any[] = [];

  constructor(
    public nav: AppNavbarService,
    private service: ListaControleEspecialService) {
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