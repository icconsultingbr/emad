import { Component, OnInit } from '@angular/core';
import { ProfissionalService } from './profissional.service';
import { Profissional } from '../../_core/_models/Profissional';
import { AppNavbarService } from '../../_core/_components/app-navbar/app-navbar.service';
import { Router } from '@angular/router';
import { environment } from "../../../environments/environment";

@Component({
  selector: 'app-profissional',
  templateUrl: './profissional.component.html',
  styleUrls: ['./profissional.component.css'],
  providers: [ProfissionalService]
})

export class ProfissionalComponent implements OnInit {  
  method: String = "profissional";
  domains: any[] = [];
  fields = [];
  fieldsSearch = [];
  object: Profissional = new Profissional();
  virtualDirectory: String = environment.virtualDirectory != "" ? environment.virtualDirectory + "/" : "";

  urls : any[] = [
    { 
      icon : 'fa-calendar',
      label : 'Escala',
      url : this.router.url.replace('profissional','') + this.virtualDirectory + "#/escalas-profissionais/id/{id}",
      log: 'escala-profissional/view-escala',
      title: 'Visualizar escala',
      self: true
    }
  ]

  constructor(
    public nav: AppNavbarService,
    private service: ProfissionalService,
    private router: Router) {

    for (let field of this.service.fields) {
      if (field.grid) {
        this.fields.push(field);
      }
      if (field.filter && field.grid) {
        this.fieldsSearch.push(field);
      }
    }
    this.loadDomains();
  }

  ngOnInit() {
    this.nav.show();
  }

  loadDomains() {
    this.service.listDomains('especialidade').subscribe(especialidades => {
        this.domains.push({
          idEspecialidade : especialidades          
        })
    });
  }
}
