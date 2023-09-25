import { Component, OnInit } from '@angular/core';
import { MetodoExameService } from './metodo-exame.service';
import { MetodoExame } from '../../../_core/_models/MetodoExame';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-metodo-exame-form',
    templateUrl: './metodo-exame-form.component.html',
    styleUrls: ['./metodo-exame-form.component.css'],
    providers: [MetodoExameService]
})

export class MetodoExameFormComponent implements OnInit {

  object: MetodoExame = new MetodoExame();
  method: String = 'metodo-exame';
  fields: any[] = [];
  label: String = 'Métodos de exame';
  id: Number = null;
  domains: any[] = [];

  constructor(
    fb: FormBuilder,
    private service: MetodoExameService,
    private route: ActivatedRoute) {
      this.fields = service.fields;
    }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });

  }

}
