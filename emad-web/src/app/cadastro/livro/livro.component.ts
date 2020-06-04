import { Component, OnInit } from '@angular/core';
import { AppNavbarService } from '../../_core/_components/app-navbar/app-navbar.service';
import { LivroService } from './livro.service';
import { Livro } from '../../_core/_models/Livro';

@Component({
    selector: 'app-livro',
    templateUrl: './livro.component.html',
    styleUrls: ['./livro.component.css'],
    providers: [LivroService]
})

export class LivroComponent implements OnInit {

  method: String = "livro";
  object: Livro = new Livro();
  fields: any[] = [];
  fieldsSearch: any[] = [];

  constructor(
    public nav: AppNavbarService,
    private service: LivroService) {
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