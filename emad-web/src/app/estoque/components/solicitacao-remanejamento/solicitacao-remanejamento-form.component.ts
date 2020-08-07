import { Component, OnInit } from '@angular/core';
import { SolicitacaoRemanejamentoService } from './solicitacao-remanejamento.service';
import { SolicitacaoRemanejamento } from '../../../_core/_models/SolicitacaoRemanejamento';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-solicitacao-remanejamento-form',
    templateUrl: './solicitacao-remanejamento-form.component.html',
    styleUrls: ['./solicitacao-remanejamento-form.component.css'],
    providers: [SolicitacaoRemanejamentoService]
})

export class SolicitacaoRemanejamentoFormComponent implements OnInit {

  object: SolicitacaoRemanejamento = new SolicitacaoRemanejamento();
  method: String = "solicitacao-remanejamento";
  fields: any[] = [];
  label: String = "Solicitação de remanejamento";
  id: Number = null;
  domains: any[] = [];

  constructor(
    fb: FormBuilder,
    private service: SolicitacaoRemanejamentoService,
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
    this.service.listDomains('estabelecimento').subscribe(estabelecimentoSolicitada => {
      this.service.listDomains('estabelecimento').subscribe(estabelecimentoSolicitante => {
        this.domains.push({            
          idEstabelecimentoSolicitada: estabelecimentoSolicitada,
          idEstabelecimentoSolicitante: estabelecimentoSolicitante
        });                      
      });
    });
  }
}