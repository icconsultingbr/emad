import { Component, OnInit } from '@angular/core';
import { AppNavbarService } from '../../../_core/_components/app-navbar/app-navbar.service';
import { TipoNotificacaoService } from './tipo-notificacao.service';
import { TipoNotificacao } from '../../../_core/_models/TipoNotificacao';

@Component({
    selector: 'app-tipo-notificacao',
    templateUrl: './tipo-notificacao.component.html',
    styleUrls: ['./tipo-notificacao.component.css'],
    providers: [TipoNotificacaoService]
})

export class TipoNotificacaoComponent implements OnInit {

  method = 'tipo-notificacao';
  object: TipoNotificacao = new TipoNotificacao();
  fields: any[] = [];
  fieldsSearch: any[] = [];

  constructor(
    public nav: AppNavbarService,
    private service: TipoNotificacaoService) {
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
