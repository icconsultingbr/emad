import { Component, OnInit } from '@angular/core';
import { EstabelecimentoGrupoMaterialService } from './estabelecimento-grupo-material.service';
import { EstabelecimentoGrupoMaterial } from '../../_core/_models/EstabelecimentoGrupoMaterial';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-estabelecimento-grupo-material-form',
    templateUrl: './estabelecimento-grupo-material-form.component.html',
    styleUrls: ['./estabelecimento-grupo-material-form.component.css'],
    providers: [EstabelecimentoGrupoMaterialService]
})

export class EstabelecimentoGrupoMaterialFormComponent implements OnInit {

  object: EstabelecimentoGrupoMaterial = new EstabelecimentoGrupoMaterial();
  method = 'estabelecimento-grupo-material';
  fields: any[] = [];
  label = 'Associação de grupo de materiais ao estabelecimento';
  id: Number = null;
  domains: any[] = [];

  constructor(
    fb: FormBuilder,
    private service: EstabelecimentoGrupoMaterialService,
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
    this.service.carregaGrupoSemEstabelecimento().subscribe(grupoMaterial => {
      this.domains.push({
        idGrupoMaterial: grupoMaterial
      });
    });
  }
}
