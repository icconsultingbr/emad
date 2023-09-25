import { Component, OnInit } from '@angular/core';
import { ParametroSegurancaService } from './parametro-seguranca.service';
import { ParametroSeguranca } from '../../_core/_models/ParametroSeguranca';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-parametro-seguranca-form',
  templateUrl: './parametro-seguranca-form.component.html',
  styleUrls: ['./parametro-seguranca-form.component.css'],
  providers: [ParametroSegurancaService]
})
export class ParametroSegurancaFormComponent implements OnInit {

  object: ParametroSeguranca = new ParametroSeguranca();
  method = 'parametro-seguranca';
  fields: any[] = [];
  label = 'Parâmetros de segurança';
  id: Number = null;

  constructor(
    fb: FormBuilder,
    private service: ParametroSegurancaService,
    private route: ActivatedRoute) {
      this.fields = service.fields;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
  }

}
