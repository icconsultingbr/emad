import { Component, OnInit } from '@angular/core';
import { GrupoOrigemReceitaService } from './grupo-origem-receita.service';
import { GrupoOrigemReceita } from '../../_core/_models/GrupoOrigemReceita';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-grupo-origem-receita-form',
    templateUrl: './grupo-origem-receita-form.component.html',
    styleUrls: ['./grupo-origem-receita-form.component.css'],
    providers: [GrupoOrigemReceitaService]
})

export class GrupoOrigemReceitaFormComponent implements OnInit {

  object: GrupoOrigemReceita = new GrupoOrigemReceita();
  method: String = "grupo-origem-receita";
  fields: any[] = [];
  label: String = "Grupos de origem de receita";
  id: Number = null;

  constructor(
    fb: FormBuilder,
    private service: GrupoOrigemReceitaService,
    private route: ActivatedRoute) {
      this.fields = service.fields;
    }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
  }
}