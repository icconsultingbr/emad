import { Component, OnInit } from '@angular/core';
import { ParametroSegurancaService } from './parametro-seguranca.service';
import { ParametroSeguranca } from '../../_core/_models/ParametroSeguranca';
import { AppNavbarService } from '../../_core/_components/app-navbar/app-navbar.service';

@Component({
  selector: 'app-parametro-seguranca',
  templateUrl: './parametro-seguranca.component.html',
  styleUrls: ['./parametro-seguranca.component.css'],
  providers: [ParametroSegurancaService]
})
export class ParametroSegurancaComponent implements OnInit {

  method: String = "parametro-seguranca";
  object: ParametroSeguranca = new ParametroSeguranca();
  fields: any[] = [];
  fieldsSearch: any[] = [];

  constructor(
    public nav: AppNavbarService,
    private service: ParametroSegurancaService) {
    for (let field of this.service.fields) {
      if (field.grid) {
        this.fields.push(field);
      }
      if (field.filter) {
        this.fieldsSearch.push(field)
      }

    }

  }

  ngOnInit() {
    this.nav.show();
  }

}
