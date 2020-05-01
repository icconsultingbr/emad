import { Component, OnInit } from '@angular/core';
import { AppNavbarService } from '../../_core/_components/app-navbar/app-navbar.service';
import { AtribuicaoCanetaService } from './atribuicao-caneta.service';
import { AtribuicaoCaneta } from '../../_core/_models/AtribuicaoCaneta';

@Component({
  selector: 'app-atribuicao-caneta',
  templateUrl: './atribuicao-caneta.component.html',
  styleUrls: ['./atribuicao-caneta.component.css'],
  providers: [AtribuicaoCanetaService]
})
export class AtribuicaoCanetaComponent implements OnInit {

  method: String = "atribuicao-caneta";
  domains: any[] = [];
  fields = [];
  fieldsSearch = [];
  object: AtribuicaoCaneta = new AtribuicaoCaneta();

  constructor(
    public nav: AppNavbarService,
    private service: AtribuicaoCanetaService) {

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