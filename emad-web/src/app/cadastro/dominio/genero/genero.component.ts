import { Component, OnInit } from '@angular/core';
import { AppNavbarService } from '../../../_core/_components/app-navbar/app-navbar.service';
import { GeneroService } from './genero.service';
import { Genero } from '../../../_core/_models/Genero';

@Component({
  selector: 'app-genero',
  templateUrl: './genero.component.html',
  styleUrls: ['./genero.component.css'],
  providers: [GeneroService]
})

export class GeneroComponent implements OnInit {

  method = 'genero';
  object: Genero = new Genero();
  fields: any[] = [];
  fieldsSearch: any[] = [];

  constructor(
    public nav: AppNavbarService,
    private service: GeneroService) {
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
