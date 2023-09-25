import { Component, OnInit } from '@angular/core';
import { ClassificacaoRiscoService } from './classificacao-risco.service';
import { ClassificacaoRisco } from '../../../_core/_models/ClassificacaoRisco';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-classificacao-risco-form',
    templateUrl: './classificacao-risco-form.component.html',
    styleUrls: ['./classificacao-risco-form.component.css'],
    providers: [ClassificacaoRiscoService]
})

export class ClassificacaoRiscoFormComponent implements OnInit {

  object: ClassificacaoRisco = new ClassificacaoRisco();
  method = 'classificacao-risco';
  fields: any[] = [];
  label = 'Classificação de risco';
  id: Number = null;
  domains: any[] = [];

  constructor(
    fb: FormBuilder,
    private service: ClassificacaoRiscoService,
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
    this.service.listDomains('cor-classificacao-risco').subscribe(corClassificacaoRisco => {
      this.domains.push({
        idCorClassificacaoRisco: corClassificacaoRisco
      });
    });
  }

}
