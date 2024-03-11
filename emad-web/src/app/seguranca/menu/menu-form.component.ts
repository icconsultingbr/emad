import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Menu } from '../../_core/_models/Menu';
import { MenuService } from './menu.service';
import { ActivatedRoute } from '@angular/router';
import { Util } from '../../_core/_util/Util';

@Component({
  selector: 'app-menu-form',
  templateUrl: './menu-form.component.html',
  styleUrls: ['./menu-form.component.css']
})
export class MenuFormComponent {

  object: Menu = new Menu();
  method = 'menu';
  fields = [];
  domains = [];
  loading: Boolean = false;
  errors: any[] = [];

  label = 'Menu';
  id: Number = null;

  constructor(
    private service: MenuService,
    private route: ActivatedRoute) {

    this.fields = service.fields;

    service.list(this.method).subscribe(menus => {
      this.domains.push({
        menuPai: menus,
        ordem: [],
        tipo: [
          { id: 1, nome: 'Interno' },
          { id: 2, nome: 'Externo' }
        ],
      });
      this.buscaOrdemDisponivelMenu();
    });

    this.route.params.subscribe( params => this.id = params.id );
  }

  buscaOrdemDisponivelMenu() {
    this.loading = true;
       this.service.listOrdem('menu/ordem-menu-filho/0').subscribe(result => {
        this.domains[0].ordem = result;
        this.loading = false;
      }, error => {
        this.loading = false;
        this.errors = Util.customHTTPResponse(error);
      });
  }
}







