import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AppService } from './app.service';
import { Menu } from './_core/_models/Menu';
import { AuthGuard } from './_core/_guards';
import { Usuario } from './_core/_models/Usuario';
import { Util } from './_core/_util/Util';
import { LoginService } from './login/login.service';
import * as $ from 'jquery';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, AfterViewInit {
  title = 'app';
  teste : number = (window.innerHeight);
  urlFoto : String = Util.urlapi+ "/profile/";
  usuario : Usuario = new Usuario();
  auth : AuthGuard;
  route: String = "";
  menus: Menu[];

  teste2 : String = "";


  clicked: string = null;
  showMenu = true;

  estabelecimentoNome : String = null;

  constructor(
    public service : AppService,  
    private router: Router, 
    location : Location, 
    auth : AuthGuard, 
    public loginService : LoginService, 
    private elementRef : ElementRef, 
    private appService: AppService) { 
    
    this.auth = auth;

    router.events.subscribe((val) => {
      if(location.path() != ''){
        this.route = location.path();
      } else {
        this.route = '/';
      }
    });
    

    if(auth.canActivate()){
      this.getMenuLista();
    }
  }

  

  getMenuLista(){
    this.service.list().subscribe(menu=>{
    this.menus = menu;
    
    this.usuario = this.auth.getUser();
    localStorage.setItem('menu', JSON.stringify(menu));
    
    }, erro => {
      //console.log(erro);
      if(erro.status==401){
        this.loginService.logout(); 
        this.router.navigate(['/login']);
      }
    });
  } 

  abre(){
    this.showMenu = !this.showMenu;
  }

  ngOnInit(){

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

  ngAfterViewInit(){
    if(location.pathname!= "/login"){

      //console.log('login');
      //this.elementRef.nativeElement.ownerDocument.body.style.background = "url(../../assets/imgs/bglogin4.jpg)";
      this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = "#FFFFFF";

    }

    if(localStorage.getItem("est")){
      this.estabelecimentoNome =  JSON.parse(localStorage.getItem("est"))[0].nomeFantasia;

     }
  }

  sideNavClick(clicked: string) {
    this.clicked = this.clicked == clicked ? null : clicked;
  }

  sideNavAlert(): void {
      alert("sublist item clicked");
  }
}
