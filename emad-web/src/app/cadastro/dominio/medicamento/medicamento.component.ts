import { Component, OnInit } from '@angular/core';
import { MedicamentoService } from './medicamento.service';
import { Medicamento } from '../../../_core/_models/Medicamento';
import { AppNavbarService } from '../../../_core/_components/app-navbar/app-navbar.service';

@Component({
  selector: 'app-medicamento',
  templateUrl: './medicamento.component.html',
  styleUrls: ['./medicamento.component.css'],
  providers: [MedicamentoService]
})
export class MedicamentoComponent implements OnInit {

  method: String = "medicamento";
  object: Medicamento = new Medicamento();
  fields: any[] = [];
  fieldsSearch: any[] = [];

  constructor(
    public nav: AppNavbarService,
    private service: MedicamentoService) {
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
