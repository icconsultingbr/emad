import { Component, OnInit } from '@angular/core';
import { EstoqueService } from './estoque.service';
import { Estoque } from '../../_core/_models/Estoque';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-estoque-form',
    templateUrl: './estoque-form.component.html',
    styleUrls: ['./estoque-form.component.css'],
    providers: [EstoqueService]
})

export class EstoqueFormComponent implements OnInit {

  object: Estoque = new Estoque();
  method: String = "estoque";
  fields: any[] = [];
  label: String = "Estoque";
  id: Number = null;
  domains: any[] = [];

  constructor(
    fb: FormBuilder,
    private service: EstoqueService,
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
    this.service.listDomains('tipo-movimento').subscribe(tipoMovimento => {
      this.domains.push({            
        idTipoMovimento: tipoMovimento
       }); 
    });
  }
}