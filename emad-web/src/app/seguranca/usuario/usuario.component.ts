import { Component, OnInit } from '@angular/core';
import { UsuarioService } from './usuario.service';
import { Usuario } from '../../_core/_models/Usuario';
import { AppNavbarService } from '../../_core/_components/app-navbar/app-navbar.service';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

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
  virtualDirectory: string = environment.virtualDirectory != "" ? environment.virtualDirectory + "/" : "";

  urls : any[] = [
    { 
      icon : 'fa-key',
      label : 'Alterar senha',
      url : this.router.url.replace('usuarios','') + this.virtualDirectory + "#/usuarios/alterar-senha/id/{id}",
      log: 'usuario/alterar-senha',
      title: 'Alterar senha',
      self: true
    }
  ]


  constructor(
    public nav: AppNavbarService,
    service: UsuarioService,
    private router: Router) {

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
