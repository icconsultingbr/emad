import { Component, OnInit } from '@angular/core';
import { CorClassificacaoRiscoService } from './cor-classificacao-risco.service';
import { CorClassificacaoRisco } from '../../../_core/_models/CorClassificacaoRisco';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-cor-classificacao-risco-form',
    templateUrl: './cor-classificacao-risco-form.component.html',
    styleUrls: ['./cor-classificacao-risco-form.component.css'],
    providers: [CorClassificacaoRiscoService]
})

export class CorClassificacaoRiscoFormComponent implements OnInit {

  object: CorClassificacaoRisco = new CorClassificacaoRisco();
  method = 'cor-classificacao-risco';
  fields: any[] = [];
  label = 'Cor de classificação do risco';
  id: Number = null;
  domains: any[] = [];

  constructor(
    fb: FormBuilder,
    private service: CorClassificacaoRiscoService,
    private route: ActivatedRoute) {
      this.fields = service.fields;
    }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });

  }

}
