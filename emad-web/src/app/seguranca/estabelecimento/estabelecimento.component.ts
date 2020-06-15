import { Component, OnInit } from '@angular/core';
import { AppNavbarService } from '../../_core/_components/app-navbar/app-navbar.service';
import { EstabelecimentoService } from './estabelecimento.service';
import { Estabelecimento } from '../../_core/_models/Estabelecimento';

@Component({
  selector: 'app-estabelecimento',
  templateUrl: './estabelecimento.component.html',
  styleUrls: ['./estabelecimento.component.css']
})
export class EstabelecimentoComponent implements OnInit {

  method: string = "estabelecimento";

  fields = [];
  fieldsSearch = [];
  object: Estabelecimento = new Estabelecimento();

  constructor(
    public nav: AppNavbarService,
    private service: EstabelecimentoService) {

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