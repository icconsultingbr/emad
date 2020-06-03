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
  method: String = "tipo-ficha";
  fields: any[] = [];
  label: String = "Tipo de ficha";
  id: Number = null;

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
  }
}