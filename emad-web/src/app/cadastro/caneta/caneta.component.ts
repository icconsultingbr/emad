import { Component, OnInit } from '@angular/core';
import { Caneta } from '../../_core/_models/Caneta';
import { AppNavbarService } from '../../_core/_components/app-navbar/app-navbar.service';
import { CanetaService } from './caneta.service';

@Component({
  selector: 'app-caneta',
  templateUrl: './caneta.component.html',
  styleUrls: ['./caneta.component.css'],
  providers: [CanetaService]
})
export class CanetaComponent implements OnInit {

  method = 'caneta';
  domains: any[] = [];
  fields = [];
  object: Caneta = new Caneta();

  constructor(
    public nav: AppNavbarService,
    private service: CanetaService) {

    for (const field of this.service.fields) {
      if (field.grid) {
        this.fields.push(field);
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
