import { Component, OnInit } from '@angular/core';
import { TipoExameService } from './tipo-exame.service';
import { TipoExame } from '../../../_core/_models/TipoExame';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-tipo-exame-form',
    templateUrl: './tipo-exame-form.component.html',
    styleUrls: ['./tipo-exame-form.component.css'],
    providers: [TipoExameService]
})

export class TipoExameFormComponent implements OnInit {

  object: TipoExame = new TipoExame();
  method: String = "tipo-exame";
  fields: any[] = [];
  label: String = "Tipo de exame";
  id: Number = null;
  domains: any[] = [];

  constructor(
    fb: FormBuilder,
    private service: TipoExameService,
    private route: ActivatedRoute) {
      this.fields = service.fields;
    }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });

  }

}