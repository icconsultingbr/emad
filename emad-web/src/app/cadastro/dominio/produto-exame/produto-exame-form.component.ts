import { Component, OnInit } from '@angular/core';
import { ProdutoExameService } from './produto-exame.service';
import { ProdutoExame } from '../../../_core/_models/ProdutoExame';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-produto-exame-form',
    templateUrl: './produto-exame-form.component.html',
    styleUrls: ['./produto-exame-form.component.css'],
    providers: [ProdutoExameService]
})

export class ProdutoExameFormComponent implements OnInit {

  object: ProdutoExame = new ProdutoExame();
  method: String = 'produto-exame';
  fields: any[] = [];
  label: String = 'Produtos de exame';
  id: Number = null;
  domains: any[] = [];

  constructor(
    fb: FormBuilder,
    private service: ProdutoExameService,
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
    this.service.listDomains('tipo-exame').subscribe(tipoExame => {
      this.domains.push({
        idTipoExame: tipoExame
      });
    });
  }
}
