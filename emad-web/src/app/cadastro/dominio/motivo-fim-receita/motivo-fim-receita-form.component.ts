import { Component, OnInit } from '@angular/core';
import { MotivoFimReceitaService } from './motivo-fim-receita.service';
import { MotivoFimReceita } from '../../../_core/_models/MotivoFimReceita';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-motivo-fim-receita-form',
    templateUrl: './motivo-fim-receita-form.component.html',
    styleUrls: ['./motivo-fim-receita-form.component.css'],
    providers: [MotivoFimReceitaService]
})

export class MotivoFimReceitaFormComponent implements OnInit {

  object: MotivoFimReceita = new MotivoFimReceita();
  method: string = "motivo-fim-receita";
  fields: any[] = [];
  label: string = "Motivo fim receita";
  id: Number = null;
  domains: any[] = [];

  constructor(
    fb: FormBuilder,
    private service: MotivoFimReceitaService,
    private route: ActivatedRoute) {
      this.fields = service.fields;
    }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });

  }

}