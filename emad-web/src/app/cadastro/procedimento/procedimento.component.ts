import { Component, OnInit } from '@angular/core';
import { AppNavbarService } from '../../_core/_components/app-navbar/app-navbar.service';
import { Router } from '@angular/router';
import { ProcedimentoService } from './procedimento.service';
import { Procedimento } from '../../_core/_models/Procedimento';

@Component({
  selector: 'app-procedimento',
  templateUrl: './procedimento.component.html',
  styleUrls: ['./procedimento.component.css'],
  providers: [ProcedimentoService]
})

export class ProcedimentoComponent implements OnInit {
  method = 'procedimento';
  domains: any[] = [];
  fields = [];
  fieldsSearch = [];
  object: Procedimento = new Procedimento();

  constructor(
    public nav: AppNavbarService,
    private service: ProcedimentoService,
    private router: Router) {

    for (const field of this.service.fields) {
      if (field.grid) {
        this.fields.push(field);
      }
      if (field.filter && field.grid) {
        this.fieldsSearch.push(field);
      }
    }
  }

  ngOnInit() {
    this.nav.show();
  }
}
