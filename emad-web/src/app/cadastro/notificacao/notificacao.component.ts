import { Component, OnInit } from '@angular/core';
import { AppNavbarService } from '../../_core/_components/app-navbar/app-navbar.service';
import { NotificacaoService } from './notificacao.service';
import { Notificacao } from '../../_core/_models/Notificacao';

@Component({
    selector: 'app-notificacao',
    templateUrl: './notificacao.component.html',
    styleUrls: ['./notificacao.component.css'],
    providers: [NotificacaoService]
})

export class NotificacaoComponent implements OnInit {

  method = 'notificacao';
  object: Notificacao = new Notificacao();
  fields: any[] = [];
  fieldsSearch: any[] = [];

  constructor(
    public nav: AppNavbarService,
    private service: NotificacaoService) {
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
