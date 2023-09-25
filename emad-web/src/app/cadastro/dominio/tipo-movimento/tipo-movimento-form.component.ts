import { Component, OnInit } from '@angular/core';
import { TipoMovimentoService } from './tipo-movimento.service';
import { TipoMovimento } from '../../../_core/_models/TipoMovimento';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-tipo-movimento-form',
    templateUrl: './tipo-movimento-form.component.html',
    styleUrls: ['./tipo-movimento-form.component.css'],
    providers: [TipoMovimentoService]
})

export class TipoMovimentoFormComponent implements OnInit {

  object: TipoMovimento = new TipoMovimento();
  method = 'tipo-movimento';
  fields: any[] = [];
  label = 'Tipo de movimento';
  id: Number = null;
  domains: any[] = [];

  constructor(
    fb: FormBuilder,
    private service: TipoMovimentoService,
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
    this.domains.push({
      operacao: [
        { id: 1, nome: 'Entrada' },
        { id: 2, nome: 'Saída' },
        { id: 3, nome: 'Perda' }
      ],
      loteBloqueado: [
        { id: 1, nome: '' },
        { id: 2, nome: 'Sim' },
        { id: 3, nome: 'Não' }
      ],
      loteVencido: [
        { id: 1, nome: '' },
        { id: 2, nome: 'Sim' },
        { id: 3, nome: 'Não' }
      ]
   });
  }
}
