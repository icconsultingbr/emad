import { Component, OnInit } from '@angular/core';
import { UsuarioService } from './usuario.service';
import { Usuario } from '../../_core/_models/Usuario';
import { AppNavbarService } from '../../_core/_components/app-navbar/app-navbar.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  method: string = "usuario";
  service: UsuarioService;
  fields = [];
  fieldsSearch = [];
  domains = [];
  object: Usuario = new Usuario();



  constructor(
    public nav: AppNavbarService,
    service: UsuarioService) {

    this.service = service;

    for (let field of service.fields) {
      if (field.grid) {
        this.fields.push(field);
      }

      if (field.filter) {
        this.fieldsSearch.push(field);
      }
    }


    this.domains.push({
      situacao: [{ id: "false", nome: "Inativo" }, { id: "true", nome: "Ativo" }],
    });

  }

  ngOnInit() {
    this.nav.show();
  }

}
