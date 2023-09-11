import { Component, OnInit, Input, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Util } from '../_core/_util/Util';
import { AppNavbarService } from '../_core/_components/app-navbar/app-navbar.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  forgotForm: FormGroup;
  service: LoginService;
  route: ActivatedRoute;
  router: Router;
  carregando: boolean = false;
  loginRealizado: boolean = false;
  erro: string = "";
  isErro: Boolean = false;
  logo: string = Util.urlapi + "/logos/logo_" + window.location.hostname + ".png";
  url_logo = "assets/imgs/logotipo-e-atende.png";
  domains: any[] = [];
  estabelecimentosCompleto: any[] = [];
  estabelecimentoLogin: "0";  

  sucesso: string = "";
  isSucesso: Boolean = false; 

  ano: number = new Date().getFullYear();

  forgotP: boolean = false;

  constructor(
    public nav: AppNavbarService,
    service: LoginService,
    fb: FormBuilder,
    route: ActivatedRoute,
    router: Router,
    private elementRef: ElementRef) {


    this.service = service;
    this.route = route;
    this.router = router;


    this.loginForm = fb.group({
      email: ['', Validators.compose([Validators.required])],
      senha: ['', Validators.required],
      estabelecimentoLogin: ['', ''],
    });

    this.forgotForm = fb.group({
      emailForgot: ['', Validators.compose([Validators.required])]
    });

  }

  logar(event) {
    event.preventDefault();
    this.isErro = false;
    this.erro = "";

    this.carregando = true;
    
    if(this.loginForm.value.estabelecimentoLogin && this.loginForm.value.estabelecimentoLogin > 0)
    {
        var estabelecimento = this.estabelecimentosCompleto.filter((estabelecimento) => estabelecimento.id == this.loginForm.value.estabelecimentoLogin);      
        localStorage.setItem('est', JSON.stringify(estabelecimento));
        this.carregando = false;
        window.location.href = window.location.href.replace("#/login", "");

        return;     
    } 

    if(this.loginForm.value.estabelecimentoLogin == "0" && this.estabelecimentosCompleto.length > 0)
    {
        this.isErro = true;
        this.erro = "Selecione o estabelecimento";
        this.carregando = false;
        return;     
    } 

    this.service.login(this.loginForm.value)
      .subscribe((res: any) => {
        if (res.token) {
          this.domains.push({
            estabelecimentos: res.estabelecimentos
          });
          this.estabelecimentoLogin = "0";
          this.estabelecimentosCompleto = res.estabelecimentos;
          this.loginRealizado = true;
          localStorage.setItem('currentUser', JSON.stringify(res));
          if(localStorage.getItem('est')){
            localStorage.removeItem('est');
          }
          this.carregando = false;
        }
      }, error => {
        
        this.loginRealizado = false;
        this.isErro = true;

        if (error.status || error.length > 0) {

          this.carregando = false;

          var msg = error;
          this.erro = msg[0].msg;

        } else {
          this.erro = "Serviço indisponível";
        }

        this.carregando = false;
      });
  }

  ngOnInit() {
    this.nav.hide();
    this.elementRef.nativeElement.ownerDocument.body.style.background = "url(assets/imgs/bglogin2.jpg)";
  }

  resolved(captchaResponse: string) {
    //console.log(`Resolved captcha with response ${captchaResponse}:`);
  }

  forgotPassword() {
    this.forgotP = !this.forgotP;
    this.isSucesso = false;
    this.sucesso = "";
    this.isErro = false;
    this.erro = "";
  }

  solicitarSenha(event) {
    event.preventDefault();
    this.isSucesso = false;
    this.sucesso = "";
    this.isErro = false;
    this.erro = "";

    this.carregando = true;
    this.service.recuperarSenha(this.forgotForm.value)
      .subscribe(res => {

        this.isSucesso = true;
        this.sucesso = "Solicitação enviada com sucesso!";

        this.isErro = false;
        this.erro = "";
        this.carregando = false;


      }, error => {
        this.isErro = true;
        var msg = JSON.parse(error);
        this.erro = msg[0].msg;

        this.carregando = false;
      });
  }
}
