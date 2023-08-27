import { Component, OnInit } from '@angular/core';
import { AppNavbarService } from '../../../_core/_components/app-navbar/app-navbar.service';
import { ConfiguracaoAtendimentoGridView } from '../../../_core/_models/ConfiguracaoAtendimentoGridView';
import { TipoFicha } from '../../../_core/_models/TipoFicha';
import { ConfiguracaoAtendimentoService } from './configuracao-atendimento.service';

@Component({
    selector: 'app-configuracao-atendimento',
    templateUrl: './configuracao-atendimento.component.html',
    styleUrls: ['./configuracao-atendimento.component.css'],
    providers: [ConfiguracaoAtendimentoService]
})

export class ConfiguracaoAtendimentoComponent implements OnInit {

  method: string = "configuracao-atendimento";
  object: ConfiguracaoAtendimentoGridView = new ConfiguracaoAtendimentoGridView();
  fields: any[] = [];
  fieldsSearch: any[] = [];

  constructor(
    public nav: AppNavbarService,
    private service: ConfiguracaoAtendimentoService) {
    for (let field of this.service.fields) {
      if (field.grid) {
        this.fields.push(field);
      }
      if (field.filter) {
        this.fieldsSearch.push(field);
      }
    }
  }

  ngOnInit() {
    this.nav.show();
  }
}