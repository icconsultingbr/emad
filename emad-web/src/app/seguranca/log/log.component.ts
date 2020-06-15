import { Component, OnInit } from '@angular/core';
import { Log } from '../../_core/_models/Log';
import { AppNavbarService } from '../../_core/_components/app-navbar/app-navbar.service';
import { LogService } from './log.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.css']
})
export class LogComponent implements OnInit {

  method: string = "log";
  object: Log = new Log();
  domains: any[] = [];
  fields = [];
  fieldsSearch = [];

  constructor(
    public nav: AppNavbarService,
    private service: LogService) {
      
      for (let field of this.service.fields) {
        if (field.grid) {
          this.fields.push(field);
        }
        if (field.filter && field.filter.grid) {
          this.fieldsSearch.push(field);
        }
      }
      this.loadDomains();

  }

  ngOnInit() {
    this.nav.show();
  }

  loadDomains() {
    this.service.listDomains('estabelecimento').subscribe(estabelecimentos => {
      this.domains.push({
        idEstabelecimento: estabelecimentos
      })
    });
  }

}
