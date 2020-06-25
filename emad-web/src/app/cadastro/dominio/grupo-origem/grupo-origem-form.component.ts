import { Component, OnInit } from '@angular/core';
import { GrupoOrigemService } from './grupo-origem.service';
import { GrupoOrigem } from '../../../_core/_models/GrupoOrigem';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-grupo-origem-form',
    templateUrl: './grupo-origem-form.component.html',
    styleUrls: ['./grupo-origem-form.component.css'],
    providers: [GrupoOrigemService]
})

export class GrupoOrigemFormComponent implements OnInit {

  object: GrupoOrigem = new GrupoOrigem();
  method: String = "grupo-origem";
  fields: any[] = [];
  label: String = "Grupos de origem";
  id: Number = null;
  domains: any[] = [];

  constructor(
    fb: FormBuilder,
    private service: GrupoOrigemService,
    private route: ActivatedRoute) {
      this.fields = service.fields;
    }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });

  }

}