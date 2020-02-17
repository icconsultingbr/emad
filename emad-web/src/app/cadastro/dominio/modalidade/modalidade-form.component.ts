import { Component, OnInit } from '@angular/core';
import { ModalidadeService } from './modalidade.service';
import { Modalidade } from '../../../_core/_models/Modalidade';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-modalidade-form',
  templateUrl: './modalidade-form.component.html',
  styleUrls: ['./modalidade-form.component.css'],
  providers: [ModalidadeService]
})
export class ModalidadeFormComponent implements OnInit {

  object: Modalidade = new Modalidade();
  method: String = 'modalidade';
  fields: any[] = [];
  label: String = "Modalidade";
  id: Number = null;

  constructor(
    fb: FormBuilder,
    private service: ModalidadeService,
    private route: ActivatedRoute) {
    this.fields = service.fields;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
  }

}
