import { Component, OnInit, Input } from '@angular/core';
import { UsuarioService } from './usuario.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Senha } from '../../_core/_models/Senha';
import { LoginService } from '../../login/login.service';
import { AppNavbarService } from '../../_core/_components/app-navbar/app-navbar.service';

@Component({
  selector: 'app-usuario-alterar-senha',
  templateUrl: './usuario-alterar-senha.component.html',
  styleUrls: ['./usuario-alterar-senha.component.css']
})
export class UsuarioAlterarSenhaComponent implements OnInit {

  service: UsuarioService;
  usuarioForm: FormGroup;
  route: ActivatedRoute;
  router: Router;
  mensagem: string = "";
  warning: string = "";
  usuario: Senha = new Senha();
  @Input() ep : Number = 0;
  id: number;

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
      this.id = params['id'];
      
      if (this.id) {
        this.service.buscaPorId(this.id)
          .subscribe(
            mensagem => {
              //console.log(mensagem);
              this.usuario = mensagem.usuario; 
            }
          );
      }
    });
 
    this.usuarioForm = fb.group({
      id: [this.id],
      nome: [this.usuario.nome],
      cpf: [this.usuario.cpf],      
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
    .redefinirSenhaAdmin(this.usuarioForm.value)
    .subscribe(res=>{      
      this.mensagem = "Senha alterada com sucesso!";
      this.warning = "";
      this.router.navigate(['usuarios']);
    }, erro=>{
      let json = erro; 
      this.warning ="";

      for (var key in json) {
        this.warning+="-"+json[key].msg+'\n';
      }
    });
  }
}
