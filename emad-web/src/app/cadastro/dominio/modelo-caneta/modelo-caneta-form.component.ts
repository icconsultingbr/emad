import { Component, OnInit } from '@angular/core';
import { ModeloCanetaService } from './modelo-caneta.service';
import { ModeloCaneta } from '../../../_core/_models/ModeloCaneta';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-modelo-caneta-form',
    templateUrl: './modelo-caneta-form.component.html',
    styleUrls: ['./modelo-caneta-form.component.css'],
    providers: [ModeloCanetaService]
})

export class ModeloCanetaFormComponent implements OnInit {

  object: ModeloCaneta = new ModeloCaneta();
  method: String = "modelo-caneta";
  fields: any[] = [];
  label: String = "Modelo caneta";
  id: Number = null;

  constructor(
    fb: FormBuilder,
    private service: ModeloCanetaService,
    private route: ActivatedRoute) {
      this.fields = service.fields;
    }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
  }
}