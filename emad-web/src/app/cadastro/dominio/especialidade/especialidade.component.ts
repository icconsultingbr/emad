import { Component, OnInit } from '@angular/core';
import { EspecialidadeService } from './especialidade.service';
import { Especialidade } from '../../../_core/_models/Especialidade';
import { AppNavbarService } from '../../../_core/_components/app-navbar/app-navbar.service';

@Component({
  selector: 'app-especialidade',
  templateUrl: './especialidade.component.html',
  styleUrls: ['./especialidade.component.css']
})
export class EspecialidadeComponent implements OnInit {

  method: String = "especialidade";
  object: Especialidade = new Especialidade();
  fields: any[] = [];
  fieldsSearch: any[] = [];

  constructor(
    public nav: AppNavbarService,
    private service: EspecialidadeService) {
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
