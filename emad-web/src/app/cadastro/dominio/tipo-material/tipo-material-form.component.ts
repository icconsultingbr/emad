import { Component, OnInit } from '@angular/core';
import { TipoMaterialService } from './tipo-material.service';
import { TipoMaterial } from '../../../_core/_models/TipoMaterial';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-tipo-material-form',
    templateUrl: './tipo-material-form.component.html',
    styleUrls: ['./tipo-material-form.component.css'],
    providers: [TipoMaterialService]
})

export class TipoMaterialFormComponent implements OnInit {

  object: TipoMaterial = new TipoMaterial();
  method = 'tipo-material';
  fields: any[] = [];
  label = 'Tipo de material';
  id: Number = null;
  domains: any[] = [];

  constructor(
    fb: FormBuilder,
    private service: TipoMaterialService,
    private route: ActivatedRoute) {
      this.fields = service.fields;
    }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });

  }

}
