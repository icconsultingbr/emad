import { Component, OnInit } from '@angular/core';
import { AppNavbarService } from '../../../_core/_components/app-navbar/app-navbar.service';
import { AtencaoContinuadaService } from './atencao-continuada.service';
import { AtencaoContinuada } from '../../../_core/_models/AtencaoContinuada';

@Component({
    selector: 'app-atencao-continuada',
    templateUrl: './atencao-continuada.component.html',
    styleUrls: ['./atencao-continuada.component.css'],
    providers: [AtencaoContinuadaService]
})

export class AtencaoContinuadaComponent implements OnInit {

  method: string = "atencao-continuada";
  object: AtencaoContinuada = new AtencaoContinuada();
  fields: any[] = [];
  fieldsSearch: any[] = [];

  constructor(
    public nav: AppNavbarService,
    private service: AtencaoContinuadaService) {
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