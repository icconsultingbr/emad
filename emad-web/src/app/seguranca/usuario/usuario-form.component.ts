import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../_core/_models/Usuario';
import { UsuarioService } from './usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppNavbarService } from '../../_core/_components/app-navbar/app-navbar.service';
import { AuthService } from '../../_core/auth/auth.service';
import { UserInfoService } from '../../_core/_services/user-info.service';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent implements OnInit {

  method = 'usuario';
  label = 'Usuário';
  fields = [];
  domains = [];
  id: Number = null;

  loadPhoto = false;

  service: UsuarioService;
  usuarioForm: FormGroup;
  groupForm: any = {};
  route: ActivatedRoute;
  router: Router;
  mensagem = '';
  warning = '';
  usuario: Usuario = new Usuario();
  dropdownSettings: any;

  constructor(
    public nav: AppNavbarService,
    private fb: FormBuilder,
    route: ActivatedRoute,
    router: Router,
    service: UsuarioService,
    private authService: AuthService,
    private userInfoService: UserInfoService) {

    this.route = route;
    this.router = router;
    this.service = service;


    this.service.list('tipo-usuario').subscribe(tiposUsuario => {
      this.service.listDomains('estabelecimento').subscribe(estabelecimentos => {
        this.domains.push({

          estabelecimentos: estabelecimentos,
          idTipoUsuario: tiposUsuario,
          sexo: [{ id: 'M', nome: 'Masculino' }, { id: 'F', nome: 'Feminino' }]
        });
      });
    });


    this.route.params.subscribe(params => {
      const id = params['id'];

      if (id) {
        this.service.buscaPorId(id).subscribe(
          res => {
            this.usuario = res.usuario;
            this.photoSaved(this.usuario.foto);
            this.loadPhoto = true;
          }
        );
      } else {
        this.loadPhoto = true;
      }
    });

    this.fields = service.fields;
    this.route.params.subscribe(params => this.id = params.id);
  }

  cadastrar(event) {
    this.service
      .cadastra(this.usuarioForm.value)
      .subscribe(res => {
        if (this.usuarioForm.value.id) {

          if (this.usuarioForm.value.id == this.userInfoService.getUserId()) {
            this.userInfoService.changePhotoUser(this.usuarioForm.value.foto);
          }

          this.router.navigate(['usuarios']);
        }

        this.mensagem = 'Cadastro efetuado com sucesso!';
        this.warning = '';
        this.usuarioForm.reset();


      }, erro => {
        const json = erro;
        this.warning = '';

        for (const key in json) {
          this.warning += '-' + json[key].msg + '\n';
        }
      }
      );
  }


  ngOnInit() {

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'nome',
      selectAllText: 'Marcar todos',
      unSelectAllText: 'Desmarcar todos',
      searchPlaceholderText: 'Procurar',
      noDataAvailablePlaceholderText: 'Sem dados disponíveis',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    this.createGroup();

  }

  createGroup() {
    this.route.params.subscribe(params => {
      this.id = params['id'];

      for (const field of this.fields) {
        if (this.id) {
          if (!field.onlyCreate) {
            this.groupForm[field.field] = field.validator;
          }
        } else {
          this.groupForm[field.field] = field.validator;
        }
      }
      this.usuarioForm = this.fb.group(this.groupForm);

    });
  }

  photoSaved(id: string) {
    this.usuarioForm.patchValue({ foto: id }, { emitEvent: false });
  }
}
