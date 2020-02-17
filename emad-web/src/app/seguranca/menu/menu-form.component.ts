import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Menu } from '../../_core/_models/Menu';
import { MenuService } from './menu.service'; 
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-menu-form',
  templateUrl: './menu-form.component.html',
  styleUrls: ['./menu-form.component.css']
}) 
export class MenuFormComponent {

  object : Menu = new Menu(); 
  method : String = 'menu';
  fields = []; 
  domains = [];

  label : String = "Menu";
  id : Number = null;

  constructor(
    service : MenuService, 
    private route: ActivatedRoute) {

    this.fields = service.fields;
 
    service.list(this.method).subscribe(menus=>{
      this.domains.push({
        menuPai:menus
      });
    });

    this.route.params.subscribe( params => this.id = params.id );
  }
}
  

 