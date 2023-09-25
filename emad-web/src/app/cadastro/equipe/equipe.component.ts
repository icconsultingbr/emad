import { Component, OnInit } from '@angular/core';
import { Equipe } from '../../_core/_models/Equipe';
import { AppNavbarService } from '../../_core/_components/app-navbar/app-navbar.service';
import { EquipeService } from './equipe.service';

@Component({
  selector: 'app-equipe',
  templateUrl: './equipe.component.html',
  styleUrls: ['./equipe.component.css'],
  providers: [EquipeService]
})
export class EquipeComponent implements OnInit {

  method = 'equipe';
  domains: any[] = [];
  fields = [];
  fieldsSearch = [];
  object: Equipe = new Equipe();

  constructor(
    public nav: AppNavbarService,
    private service: EquipeService) {

    for (const field of this.service.fields) {
      if (field.grid) {
        this.fields.push(field);
      }
      if (field.filter && field.filter.grid) {
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
      this.domains.push({
        idEstabelecimento: estabelecimentos
      });
    });
  }

}
