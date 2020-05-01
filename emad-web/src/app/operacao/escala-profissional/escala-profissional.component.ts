import { Component, OnInit } from '@angular/core';
import { AppNavbarService } from '../../_core/_components/app-navbar/app-navbar.service';
import { EscalaProfissionalService } from './escala-profissional.service';
import { EscalaProfissional } from '../../_core/_models/EscalaProfissional';

@Component({
  selector: 'app-escala-profissional',
  templateUrl: './escala-profissional.component.html',
  styleUrls: ['./escala-profissional.component.css'],
  providers: [EscalaProfissionalService]
})
export class EscalaProfissionalComponent implements OnInit {

  method: String = "escala-profissional";
  domains: any[] = [];
  fields = [];
  fieldsSearch = [];
  object: EscalaProfissional = new EscalaProfissional();

  constructor(
    public nav: AppNavbarService,
    private service: EscalaProfissionalService) {

    for (let field of this.service.fields) {
      if (field.grid) {
        this.fields.push(field);
      }
      if (field.filter) {
        this.fieldsSearch.push(field);
      }
    }
    this.loadDomains();
  }

  ngOnInit() {
    this.nav.show();
  }

  loadDomains() {
    this.service.listDomains('profissional').subscribe(profissionais => {
      this.service.listDomains('caneta').subscribe(canetas => {
        this.domains.push({
          idProfissional: profissionais,
          idCaneta: canetas
        })
      });
    });
  }
}
