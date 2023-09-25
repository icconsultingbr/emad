import { Component, OnInit } from '@angular/core';
import { TipoUsuario } from '../../_core/_models/TipoUsuario';
import { TipoUsuarioService } from './tipo-usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppNavbarService } from '../../_core/_components/app-navbar/app-navbar.service';

@Component({
  selector: 'app-tipo-usuario-form',
  templateUrl: './tipo-usuario-form.component.html',
  styleUrls: ['./tipo-usuario-form.component.css'],
  providers: [TipoUsuarioService]
})
export class TipoUsuarioFormComponent implements OnInit {

  service: TipoUsuarioService;
  tipoUsuarioForm: FormGroup;
  route: ActivatedRoute;
  router: Router;
  mensagem = '';
  warning = '';
  tipoUsuario: TipoUsuario = new TipoUsuario();

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  constructor(
    public nav: AppNavbarService,
    fb: FormBuilder,
    route: ActivatedRoute,
    router: Router,
    service: TipoUsuarioService) {

    this.route = route;
    this.router = router;
    this.service = service;


    this.tipoUsuarioForm = fb.group({
      id: [''],
      nome: ['', Validators.required],
      periodoSenha : ['', Validators.required],
      permissoes: ['', Validators.required],
      bloqueioTentativas : ['', Validators.required]
    });

    this.list();

    this.route.params.subscribe(params => {
      const id = params['id'];

      if (id) {
        this.service.buscaPorId(id).subscribe(
          res => {
            //console.log(mensagem);
            this.tipoUsuario = res;
          }
        );

        this.service.listMenuTipoUsuario(id).subscribe(
          res => {
            //console.log(mensagem);
            this.selectedItems = res;
          }
        );


      }
    });
  }

  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'nome',
      selectAllText: 'Marcar todos',
      unSelectAllText: 'Desmarcar todos',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };
  }
  onItemSelect(item: any) {
    //console.log(item);
  }
  onSelectAll(items: any) {
    //console.log(items);
  }

  cadastrar(event) {
    event.preventDefault();

    this.service
      .cadastra(this.tipoUsuarioForm.value)
      .subscribe(res => {
        if (this.tipoUsuarioForm.value.id) {
          this.router.navigate(['tipos-usuarios']);
        }
        this.mensagem = 'Cadastro efetuado com sucesso!';
        this.warning = '';
        this.tipoUsuarioForm.reset();
      }, erro => {
        const json = erro;
        this.warning = '';

        for (const key in json) {
          this.warning += '-' + json[key].msg + '\n';
        }
      });
  }

  list() {
    this.service.listMenu().subscribe(res => {
      this.dropdownList = res;
    });

  }


}

