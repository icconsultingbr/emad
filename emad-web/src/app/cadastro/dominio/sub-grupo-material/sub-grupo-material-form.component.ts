import { Component, OnInit } from '@angular/core';
import { SubGrupoMaterialService } from './sub-grupo-material.service';
import { SubGrupoMaterial } from '../../../_core/_models/SubGrupoMaterial';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-sub-grupo-material-form',
    templateUrl: './sub-grupo-material-form.component.html',
    styleUrls: ['./sub-grupo-material-form.component.css'],
    providers: [SubGrupoMaterialService]
})

export class SubGrupoMaterialFormComponent implements OnInit {

  object: SubGrupoMaterial = new SubGrupoMaterial();
  method: string = "sub-grupo-material";
  fields: any[] = [];
  label: string = "Subgrupo de material";
  id: Number = null;
  domains: any[] = [];

  constructor(
    fb: FormBuilder,
    private service: SubGrupoMaterialService,
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
        idGrupoMaterial: grupoMaterial
      });                      
    });
  }

}