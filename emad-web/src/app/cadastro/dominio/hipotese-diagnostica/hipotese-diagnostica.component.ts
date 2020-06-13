import { Component, OnInit } from '@angular/core';
import { AppNavbarService } from '../../../_core/_components/app-navbar/app-navbar.service';
import { HipoteseDiagnosticaService } from './hipotese-diagnostica.service';
import { HipoteseDiagnostica } from '../../../_core/_models/HipoteseDiagnostica';

@Component({
  selector: 'app-hipotese-diagnostica',
  templateUrl: './hipotese-diagnostica.component.html',
  styleUrls: ['./hipotese-diagnostica.component.css'],
  providers: [HipoteseDiagnosticaService]
})
export class HipoteseDiagnosticaComponent implements OnInit {

  method: string = "hipotese-diagnostica";
  object: HipoteseDiagnostica = new HipoteseDiagnostica();
  fields: any[] = [];
  fieldsSearch: any[] = [];

  constructor(
    public nav: AppNavbarService,
    private service: HipoteseDiagnosticaService) {
    for (let field of this.service.fields) {
      if (field.grid) {
        this.fields.push(field);
      }
      if (field.filter) {
        this.fieldsSearch.push(field);
      }
    }
  }

  ngOnInit() {
    this.nav.show();
  }
}
