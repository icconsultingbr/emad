import { Component, OnInit } from '@angular/core';
import { ProfissionalService } from './profissional.service';
import { Profissional } from '../../_core/_models/Profissional';
import { AppNavbarService } from '../../_core/_components/app-navbar/app-navbar.service';

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

  constructor(
    public nav: AppNavbarService,
    private service: ProfissionalService) {

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
    this.service.listDomains('estabelecimento').subscribe(estabelecimentos => {
      this.service.listDomains('especialidade').subscribe(especialidades => {
        this.domains.push({
          estabelecimentos : estabelecimentos,
          idEspecialidade : especialidades
        })

      });

    });
  }

}
