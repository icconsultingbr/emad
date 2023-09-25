import { Component, OnInit } from '@angular/core';
import { FamiliaMaterialService } from './familia-material.service';
import { FamiliaMaterial } from '../../../_core/_models/FamiliaMaterial';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-familia-material-form',
    templateUrl: './familia-material-form.component.html',
    styleUrls: ['./familia-material-form.component.css'],
    providers: [FamiliaMaterialService]
})

export class FamiliaMaterialFormComponent implements OnInit {

  object: FamiliaMaterial = new FamiliaMaterial();
  method = 'familia-material';
  fields: any[] = [];
  label = 'Família de material';
  id: Number = null;
  domains: any[] = [];

  constructor(
    fb: FormBuilder,
    private service: FamiliaMaterialService,
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
    this.service.listDomains('grupo-material').subscribe(grupoMaterial => {
      this.domains.push({
        idGrupoMaterial: grupoMaterial,
        idSubGrupoMaterial: [],
      });
    });
  }
}
