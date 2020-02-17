import { Component, OnInit } from '@angular/core';
import { TipoUsuarioService } from './tipo-usuario.service';
import { AppNavbarService } from '../../_core/_components/app-navbar/app-navbar.service';
import { TipoUsuario } from '../../_core/_models/TipoUsuario';

@Component({
  selector: 'app-tipo-usuario',
  templateUrl: './tipo-usuario.component.html',
  styleUrls: ['./tipo-usuario.component.css'],
  providers: [TipoUsuarioService]
})
export class TipoUsuarioComponent implements OnInit {

  method: String = "tipo-usuario";

  fields = [];
  fieldsSearch = [];
  object: TipoUsuario = new TipoUsuario();

  constructor(
    public nav: AppNavbarService,
    private service: TipoUsuarioService) {

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
   