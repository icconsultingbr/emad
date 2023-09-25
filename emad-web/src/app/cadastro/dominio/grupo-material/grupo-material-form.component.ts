import { Component, OnInit } from '@angular/core';
import { GrupoMaterialService } from './grupo-material.service';
import { GrupoMaterial } from '../../../_core/_models/GrupoMaterial';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-grupo-material-form',
    templateUrl: './grupo-material-form.component.html',
    styleUrls: ['./grupo-material-form.component.css'],
    providers: [GrupoMaterialService]
})

export class GrupoMaterialFormComponent implements OnInit {

  object: GrupoMaterial = new GrupoMaterial();
  method = 'grupo-material';
  fields: any[] = [];
  label = 'Grupo de material';
  id: Number = null;

  constructor(
    fb: FormBuilder,
    private service: GrupoMaterialService,
    private route: ActivatedRoute) {
      this.fields = service.fields;
    }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
  }
}
