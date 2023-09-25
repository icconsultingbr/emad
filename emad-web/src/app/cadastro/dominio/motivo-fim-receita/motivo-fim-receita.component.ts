import { Component, OnInit } from '@angular/core';
import { AppNavbarService } from '../../../_core/_components/app-navbar/app-navbar.service';
import { MotivoFimReceitaService } from './motivo-fim-receita.service';
import { MotivoFimReceita } from '../../../_core/_models/MotivoFimReceita';

@Component({
    selector: 'app-motivo-fim-receita',
    templateUrl: './motivo-fim-receita.component.html',
    styleUrls: ['./motivo-fim-receita.component.css'],
    providers: [MotivoFimReceitaService]
})

export class MotivoFimReceitaComponent implements OnInit {

  method = 'motivo-fim-receita';
  object: MotivoFimReceita = new MotivoFimReceita();
  fields: any[] = [];
  fieldsSearch: any[] = [];

  constructor(
    public nav: AppNavbarService,
    private service: MotivoFimReceitaService) {
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
