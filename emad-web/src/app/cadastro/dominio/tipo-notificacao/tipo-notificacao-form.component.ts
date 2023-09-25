import { Component, OnInit } from '@angular/core';
import { TipoNotificacaoService } from './tipo-notificacao.service';
import { TipoNotificacao } from '../../../_core/_models/TipoNotificacao';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-tipo-notificacao-form',
    templateUrl: './tipo-notificacao-form.component.html',
    styleUrls: ['./tipo-notificacao-form.component.css'],
    providers: [TipoNotificacaoService]
})

export class TipoNotificacaoFormComponent implements OnInit {

  object: TipoNotificacao = new TipoNotificacao();
  method = 'tipo-notificacao';
  fields: any[] = [];
  label = 'Tipos de notificações';
  id: Number = null;
  domains: any[] = [];

  constructor(
    fb: FormBuilder,
    private service: TipoNotificacaoService,
    private route: ActivatedRoute) {
      this.fields = service.fields;
    }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });

  }

}
