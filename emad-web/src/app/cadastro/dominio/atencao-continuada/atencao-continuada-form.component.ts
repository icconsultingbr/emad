import { Component, OnInit } from '@angular/core';
import { AtencaoContinuadaService } from './atencao-continuada.service';
import { AtencaoContinuada } from '../../../_core/_models/AtencaoContinuada';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-atencao-continuada-form',
    templateUrl: './atencao-continuada-form.component.html',
    styleUrls: ['./atencao-continuada-form.component.css'],
    providers: [AtencaoContinuadaService]
})

export class AtencaoContinuadaFormComponent implements OnInit {

  object: AtencaoContinuada = new AtencaoContinuada();
  method = 'atencao-continuada';
  fields: any[] = [];
  label = 'Grupos de atenção continuada';
  id: Number = null;

  constructor(
    fb: FormBuilder,
    private service: AtencaoContinuadaService,
    private route: ActivatedRoute) {
      this.fields = service.fields;
    }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
  }
}
