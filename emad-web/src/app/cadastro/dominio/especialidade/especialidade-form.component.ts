import { Component, OnInit } from '@angular/core';
import { EspecialidadeService } from './especialidade.service';
import { Especialidade } from '../../../_core/_models/Especialidade';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-especialidade-form',
  templateUrl: './especialidade-form.component.html',
  styleUrls: ['./especialidade-form.component.css'],
})
export class EspecialidadeFormComponent implements OnInit {

  object: Especialidade = new Especialidade();
  method = 'especialidade';
  fields: any[] = [];
  label = 'Especialidade';
  id: Number = null;

  constructor(
    fb: FormBuilder,
    private service: EspecialidadeService,
    private route: ActivatedRoute) {
      this.fields = service.fields;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
  }

}
