import { Component, OnInit } from '@angular/core';
import { AppNavbarService } from '../../../_core/_components/app-navbar/app-navbar.service';
import { OrientacaoSexualService } from './orientacao-sexual.service';
import { OrientacaoSexual } from '../../../_core/_models/OrientacaoSexual';

@Component({
  selector: 'app-orientacao-sexual',
  templateUrl: './orientacao-sexual.component.html',
  styleUrls: ['./orientacao-sexual.component.css'],
  providers: [OrientacaoSexualService]
})

export class OrientacaoSexualComponent implements OnInit {

  method = 'orientacao-sexual';
  object: OrientacaoSexual = new OrientacaoSexual();
  fields: any[] = [];
  fieldsSearch: any[] = [];

  constructor(
    public nav: AppNavbarService,
    private service: OrientacaoSexualService) {
    for (const field of this.service.fields) {
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
