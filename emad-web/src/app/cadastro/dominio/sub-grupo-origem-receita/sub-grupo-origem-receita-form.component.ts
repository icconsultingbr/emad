import { Component, OnInit } from '@angular/core';
import { SubGrupoOrigemReceitaService } from './sub-grupo-origem-receita.service';
import { SubGrupoOrigemReceita } from '../../../_core/_models/SubGrupoOrigemReceita';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-sub-grupo-origem-receita-form',
    templateUrl: './sub-grupo-origem-receita-form.component.html',
    styleUrls: ['./sub-grupo-origem-receita-form.component.css'],
    providers: [SubGrupoOrigemReceitaService]
})

export class SubGrupoOrigemReceitaFormComponent implements OnInit {

  object: SubGrupoOrigemReceita = new SubGrupoOrigemReceita();
  method: String = "sub-grupo-origem-receita";
  fields: any[] = [];
  label: String = "Subgrupo origem de receita";
  id: Number = null;
  domains: any[] = [];

  constructor(
    fb: FormBuilder,
    private service: SubGrupoOrigemReceitaService,
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
    this.service.listDomains('grupo-origem-receita').subscribe(grupoOrigemReceita => {
      this.domains.push({            
        idGrupoOrigemReceita: grupoOrigemReceita
      });                      
    });
  }

}