import { Component, OnInit } from '@angular/core';
import { TipoUnidadeService } from './tipo-unidade.service';
import { TipoUnidade } from '../../../_core/_models/TipoUnidade';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-tipo-unidade-form',
    templateUrl: './tipo-unidade-form.component.html',
    styleUrls: ['./tipo-unidade-form.component.css'],
    providers: [TipoUnidadeService]
})

export class TipoUnidadeFormComponent implements OnInit {

  object: TipoUnidade = new TipoUnidade();
  method = 'tipo-unidade';
  fields: any[] = [];
  label = 'Tipo de unidade';
  id: Number = null;

  constructor(
    fb: FormBuilder,
    private service: TipoUnidadeService,
    private route: ActivatedRoute) {
      this.fields = service.fields;
    }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
  }
}
