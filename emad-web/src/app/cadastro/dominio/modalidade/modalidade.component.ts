import { Component, OnInit } from '@angular/core';
import { ModalidadeService } from './modalidade.service';
import { Modalidade } from '../../../_core/_models/Modalidade';
import { AppNavbarService } from '../../../_core/_components/app-navbar/app-navbar.service';

@Component({
  selector: 'app-modalidade',
  templateUrl: './modalidade.component.html',
  styleUrls: ['./modalidade.component.css'],
  providers: [ModalidadeService]
})
export class ModalidadeComponent implements OnInit {

  method: String = "modalidade";
  object: Modalidade = new Modalidade();
  fields: any[] = [];
  fieldsSearch: any[] = [];

  constructor(
    public nav: AppNavbarService,
    private service: ModalidadeService) {

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
