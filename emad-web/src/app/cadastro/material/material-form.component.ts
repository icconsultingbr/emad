import { Component, OnInit } from '@angular/core';
import { MaterialService } from './material.service';
import { Material } from '../../_core/_models/Material';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-material-form',
    templateUrl: './material-form.component.html',
    styleUrls: ['./material-form.component.css'],
    providers: [MaterialService]
})

export class MaterialFormComponent implements OnInit {

  object: Material = new Material();
  method = 'material';
  fields: any[] = [];
  label = 'Materiais';
  id: Number = null;
  domains: any[] = [];

  constructor(
    fb: FormBuilder,
    private service: MaterialService,
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
    this.service.listDomains('unidade-material').subscribe(unidadeMaterial => {
      this.service.listDomains('lista-controle-especial').subscribe(listaControleEspecial => {
        this.service.listDomains('grupo-material').subscribe(grupoMaterial => {
          this.service.listDomains('tipo-material').subscribe(tipoMaterial => {
            this.service.listDomains('fabricante-material').subscribe(fabricante => {
              this.domains.push({
                idUnidadeMaterial: unidadeMaterial,
                idListaControleEspecial: listaControleEspecial,
                idGrupoMaterial: grupoMaterial,
                idSubGrupoMaterial: [],
                idFamiliaMaterial: [],
                idTipoMaterial: tipoMaterial,
                idFabricanteMaterial: fabricante,
              });
            });
          });
        });
      });
    });
  }
}
