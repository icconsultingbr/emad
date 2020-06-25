import { Component, OnInit } from '@angular/core';
import { SubgrupoOrigemService } from './subgrupo-origem.service';
import { SubgrupoOrigem } from '../../../_core/_models/SubgrupoOrigem';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-subgrupo-origem-form',
    templateUrl: './subgrupo-origem-form.component.html',
    styleUrls: ['./subgrupo-origem-form.component.css'],
    providers: [SubgrupoOrigemService]
})

export class SubgrupoOrigemFormComponent implements OnInit {

  object: SubgrupoOrigem = new SubgrupoOrigem();
  method: String = "subgrupo-origem";
  fields: any[] = [];
  label: String = "Sub grupo de origem";
  id: Number = null;
  domains: any[] = [];

  constructor(
    fb: FormBuilder,
    private service: SubgrupoOrigemService,
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
    this.service.listDomains('grupo-origem').subscribe(grupoOrigem => {
      this.domains.push({            
        idGrupoOrigem: grupoOrigem
      });                      
    });
  }

}