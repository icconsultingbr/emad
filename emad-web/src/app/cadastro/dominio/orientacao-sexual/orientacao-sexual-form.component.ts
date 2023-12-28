import { Component, OnInit } from '@angular/core';
import { OrientacaoSexual } from '../../../_core/_models/OrientacaoSexual';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { OrientacaoSexualService } from './orientacao-sexual.service';

@Component({
  selector: 'app-orientacao-sexual-form',
  templateUrl: './orientacao-sexual-form.component.html',
  styleUrls: ['./orientacao-sexual-form.component.css'],
  providers: [OrientacaoSexualService]
})

export class OrientacaoSexualFormComponent implements OnInit {

  object: OrientacaoSexual = new OrientacaoSexual();
  method = 'orientacao-sexual';
  fields: any[] = [];
  label = 'Orientacao sexual';
  id: Number = null;

  constructor(
    fb: FormBuilder,
    private service: OrientacaoSexualService,
    private route: ActivatedRoute) {
    this.fields = service.fields;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
  }
}
