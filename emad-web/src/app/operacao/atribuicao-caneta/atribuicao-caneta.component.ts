import { Component, OnInit } from '@angular/core';
import { AppNavbarService } from '../../_core/_components/app-navbar/app-navbar.service';
import { AtribuicaoCanetaService } from './atribuicao-caneta.service';
import { AtribuicaoCaneta } from '../../_core/_models/AtribuicaoCaneta';
import { Util } from '../../_core/_util/Util';

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
  errors: any[] = [];

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
    this.buscaProfissionais();
    this.buscaCaneta();
  }

  buscaProfissionais() {
       this.service.list('profissional/estabelecimento/' + JSON.parse(localStorage.getItem("est"))[0].id).subscribe(result => {
        this.domains[0].idProfissional = result;
      }, error => {
        this.errors = Util.customHTTPResponse(error);
      });
  }

  buscaCaneta() {
       this.service.list('caneta?idEstabelecimento=' + JSON.parse(localStorage.getItem("est"))[0].id).subscribe(result => {
        this.domains[0].idCaneta = result;
      }, error => {
       this.errors = Util.customHTTPResponse(error);
      });
  }

  loadDomains() {
    this.domains.push({
      idCaneta: [],
      idProfissional: []
    });
  }
}