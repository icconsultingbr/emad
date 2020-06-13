import { Component, OnInit } from '@angular/core';
import { NotificacaoService } from './notificacao.service';
import { Notificacao } from '../../_core/_models/Notificacao';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-notificacao-form',
    templateUrl: './notificacao-form.component.html',
    styleUrls: ['./notificacao-form.component.css'],
    providers: [NotificacaoService]
})

export class NotificacaoFormComponent implements OnInit {

  object: Notificacao = new Notificacao();
  method: string = "notificacao";
  fields: any[] = [];
  label: string = "Notificações";
  id: Number = null;
  domains: any[] = [];

  constructor(
    fb: FormBuilder,
    private service: NotificacaoService,
    private route: ActivatedRoute) {
      this.fields = service.fields;
    }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });

    this.loadDomains();
  }

  loadDomains() {    
    this.service.listDomains('tipo-usuario').subscribe(tipoUsuario => {
      this.service.listDomains('tipo-notificacao').subscribe(tipoNotificacao => {
        this.domains.push({            
          idTipoUsuario: tipoUsuario,
          tipo: tipoNotificacao,
          idUsuario: []
        });                      
      });                      
    });
  }
}