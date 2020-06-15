import { Component, OnInit, Input } from '@angular/core';
import { UsuarioService } from './usuario.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Senha } from '../../_core/_models/Senha';
import { LoginService } from '../../login/login.service';
import { AppNavbarService } from '../../_core/_components/app-navbar/app-navbar.service';

@Component({
  selector: 'app-usuario-reset',
  templateUrl: './usuario-reset.component.html',
  styleUrls: ['./usuario-reset.component.css']
})
export class UsuarioResetComponent implements OnInit {

  service: UsuarioService;
  usuarioForm: FormGroup;
  route: ActivatedRoute;
  router: Router;
  mensagem: string = "";
  warning: string = "";
  usuario: Senha = new Senha();
  @Input() ep : Number = 0;

  constructor(
    public nav: AppNavbarService,
    fb: FormBuilder,
    route: ActivatedRoute,
    router: Router,
    service: UsuarioService,
    public loginService : LoginService) {

    this.route = route;
    this.router = router;
    this.service = service;

    this.route.params.subscribe(params => {
      let id = params['id'];

      if (id) {
        this.service.buscaPorId(id)
          .subscribe(
            mensagem => {
              //console.log(mensagem);
              this.usuario = mensagem; 
            }
          );
      }
    });
 
    this.usuarioForm = fb.group({
      senhaAtual: ['', Validators.required],
      novaSenha: ['', Validators.required],
      confirmarNovaSenha: ['', Validators.required]
    }); 
  }

  ngOnInit() {
    this.nav.show();
  }

  redefinirSenha(event){
    event.preventDefault();

    this.service
    .redefinirSenha(this.usuarioForm.value)
    .subscribe(res=>{
      if(this.usuarioForm.value.id){
        this.router.navigate(['/']);
      }
      this.mensagem = "Senha alterada com sucesso!";
      this.warning = "";
      this.usuarioForm.reset();
      this.loginService.logout();
      this.router.navigate(['/login']);
    }, erro=>{
      let json = JSON.parse(erro._body); 
      this.warning ="";

      for (var key in json) {
        this.warning+="-"+json[key].msg+'\n';
      }
    });
  }

}
