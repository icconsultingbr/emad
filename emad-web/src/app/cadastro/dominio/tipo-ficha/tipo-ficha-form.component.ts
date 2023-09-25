import { Component, OnInit } from '@angular/core';
import { TipoFichaService } from './tipo-ficha.service';
import { TipoFicha } from '../../../_core/_models/TipoFicha';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-tipo-ficha-form',
    templateUrl: './tipo-ficha-form.component.html',
    styleUrls: ['./tipo-ficha-form.component.css'],
    providers: [TipoFichaService]
})

export class TipoFichaFormComponent implements OnInit {

  object: TipoFicha = new TipoFicha();
  method = 'tipo-ficha';
  fields: any[] = [];
  label = 'Tipo de ficha';
  id: Number = null;
  domains: any[] = [];

  constructor(
    fb: FormBuilder,
    private service: TipoFichaService,
    private route: ActivatedRoute) {
      this.fields = service.fields;
    }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    this.loadDomains();
  }

  loadDomains() {
    this.domains.push({
      tipo: [
        { id: '1', nome: 'Atendimento' },
        { id: '2', nome: 'Avaliação' },
        { id: '3', nome: 'Exame' }],
      tipoAtendimentoSus: [
        { id: '4', nome: 'Ficha de atendimento individual' },
        { id: '5', nome: 'Ficha de atendimento odontológico' },
        { id: '6', nome: 'Ficha de atividade coletiva' },
        { id: '10', nome: 'Ficha de atendimento domiciliar' }]
    });
  }
}
