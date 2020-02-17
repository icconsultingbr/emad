import { Component, OnInit, Input } from '@angular/core';

import { MenuService } from './menu.service';
import { AppNavbarService } from '../../_core/_components/app-navbar/app-navbar.service';
import { Menu } from '../../_core/_models/Menu';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  method: String = "menu";
  service: MenuService;
  fields = [];
  object: Menu = new Menu();

  constructor(
    public nav: AppNavbarService,
    service: MenuService) {

    this.service = service;
    for (let field of this.service.fields) {
      if (field.grid) {
        this.fields.push(field);
      }
    }
  }

  ngOnInit() {
    this.nav.show();
  }

}
