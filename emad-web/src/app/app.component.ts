import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AppService } from './app.service';
import { Menu } from './_core/_models/Menu';
import { AuthGuard } from './_core/_guards';
import { Usuario } from './_core/_models/Usuario';
import { Util } from './_core/_util/Util';
import { LoginService } from './login/login.service';
import { ParametroSeguranca } from './_core/_models/ParametroSeguranca';
import { SocketService } from './_core/_services/socket.service';
import { AuthService } from './_core/auth/auth.service';
import * as $ from 'jquery';
import { NotificacaoSistemaService } from './_core/_services/notificacao-sistema.service';
import { Observable, Subscription } from 'rxjs';
import { FileUploadService } from './_core/_components/app-file-upload/services/file-upload.service';
import { FileUpload } from './_core/_components/app-file-upload/model/file-upload.model';
import { UserInfoService } from './_core/_services/user-info.service';
import { environment } from '../environments/environment';
import { Especialidade } from './_core/_models/Especialidade';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, AfterViewInit {
  title = 'app';
  teste: number = (window.innerHeight);
  urlFoto: string = Util.urlapi + "/profile/";
  usuario: Usuario = new Usuario();
  auth: AuthGuard;
  route: string = "";
  menus: Menu[];
  parametrosSeguranca: ParametroSeguranca[];
  parametrosEspecialidade: Especialidade;

  image$: Observable<string>;

  teste2: string = "";

  pathFiles = `${environment.apiUrl}/fotos`;

  clicked: string = null;
  showMenu = true;

  estabelecimentoNome: string = null;

  constructor(
    public service: AppService,
    private router: Router,
    location: Location,
    auth: AuthGuard,
    public loginService: LoginService,
    private elementRef: ElementRef,
    private socketService: SocketService,
    private authService: AuthService) {

    this.auth = auth;

    router.events.subscribe((val) => {
      if (location.path() != '') {
        this.route = location.path();
      } else {
        this.route = '/';
      }
    });


    if (auth.canActivate()) {
      this.getMenuLista();
      this.getUrlsParametroLista();
      this.getParametroProfissional();
    }
  }

  getMenuLista() {
    this.service.list().subscribe(menu => {
      this.menus = menu;

      this.usuario = this.auth.getUser();

      localStorage.setItem('menu', JSON.stringify(menu));

    }, erro => {
      //console.log(erro);
      if (erro.status == 401) {
        this.loginService.logout();
        this.router.navigate(['/login']);
      }
    });
  }

  getUrlsParametroLista() {
    this.service.listUrls().subscribe(url => {
      this.parametrosSeguranca = url;

      this.usuario = this.auth.getUser();

      localStorage.setItem('parametro_seguranca', JSON.stringify(url));

    }, erro => {
      //console.log(erro);
      if (erro.status == 401) {
        this.loginService.logout();
        this.router.navigate(['/login']);
      }
    });
  }

  getParametroProfissional() {
    this.service.listEspecialidade().subscribe(parametros => {      
      this.parametrosEspecialidade = parametros;
      localStorage.setItem('especialidade', JSON.stringify(parametros));
    }, erro => {
      //console.log(erro);
      if (erro.status == 401) {
        this.loginService.logout();
        this.router.navigate(['/login']);
      }
    });
  }
  
  abre() {
    this.showMenu = !this.showMenu;
  }

  fecha() {
    this.showMenu = false;
  }

  ngOnInit() {

    const token = this.authService.getToken();
    if (!token) {
      return;
    }

    this.socketService.connect()
      .subscribe(result => {
        console.log(`notificação sistema ${result}`);
      }, (error) => {
      });

    /*if (localStorage.getItem('currentUser')) {
      this.appService.extrato.subscribe(msgSocket => {
        //console.log('notification >> ',msgSocket);
        let user = localStorage.getItem('currentUser');
        let idEmpresa = JSON.parse(user).idEmpresa;

        if (msgSocket.idEmpresa == idEmpresa) {
        }
      })

    }*/

  }

  ngAfterViewInit() {
    if (location.pathname != "/login") {

      //console.log('login');
      //this.elementRef.nativeElement.ownerDocument.body.style.background = "url(../../assets/imgs/bglogin4.jpg)";
      this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = "#FFFFFF";

    }

    if (localStorage.getItem("est")) {
      this.estabelecimentoNome = JSON.parse(localStorage.getItem("est"))[0].nomeFantasia;

    }
  }

  sideNavClick(clicked: string) {
    this.clicked = this.clicked == clicked ? null : clicked;
  }

  sideNavAlert(): void {
    alert("sublist item clicked");
  }
}
