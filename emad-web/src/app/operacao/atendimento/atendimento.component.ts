import { Component, OnInit } from '@angular/core';
import { Atendimento } from '../../_core/_models/Atendimento';
import { AppNavbarService } from '../../_core/_components/app-navbar/app-navbar.service';
import { AtendimentoService } from './atendimento.service';

@Component({
  selector: 'app-atendimento',
  templateUrl: './atendimento.component.html',
  styleUrls: ['./atendimento.component.css'],
  providers: [AtendimentoService]
})
export class AtendimentoComponent implements OnInit {
  method: String = "atendimento";
  domains: any[] = [];
  fields = [];
  fieldsSearch = [];
  object: Atendimento = new Atendimento();
  urls : any[] = [
    { 
      icon : 'fa-print',
      label : '',
      url : 
        JSON.parse(localStorage.getItem("parametro_seguranca")).filter((url) => url.nome == "URL_FICHA_MEDICA_IMPRESSAO")
        ?
        JSON.parse(localStorage.getItem("parametro_seguranca")).filter((url) => url.nome == "URL_FICHA_MEDICA_IMPRESSAO")[0].valor
        :"",
      log: 'atendimento/print-document',
      title: 'Imprimir ficha'

    }, 
    { 
      icon : 'fa-file-alt',
      label : '',
      url :  
        JSON.parse(localStorage.getItem("parametro_seguranca")).filter((url) => url.nome == "URL_FICHA_MEDICA_VISUALIZACAO")
        ?
        JSON.parse(localStorage.getItem("parametro_seguranca")).filter((url) => url.nome == "URL_FICHA_MEDICA_VISUALIZACAO")[0].valor
        :"",
      log: 'atendimento/open-document',
      title: 'Ver ficha'
    }, 
    { 
      icon : 'fa-file-medical-alt',
      label : '',
      url :  
        JSON.parse(localStorage.getItem("parametro_seguranca")).filter((url) => url.nome == "URL_RECEITA_MEDICA_VISUALIZACAO")
        ?
        JSON.parse(localStorage.getItem("parametro_seguranca")).filter((url) => url.nome == "URL_RECEITA_MEDICA_VISUALIZACAO")[0].valor
        :"",
      log: 'atendimento/receita-medica',
      title: 'Ver receita'
    },
  ]

  constructor(
    public nav: AppNavbarService,
    private service: AtendimentoService) {

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
        s: estabelecimentos,
        situacao: [
          { id: "C", nome: "Em aberto" },
          { id: "A", nome: "Alta" },          
          { id: "E", nome: "Evasão" },
          { id: "O", nome: "Óbito" },
          { id: "X", nome: "Cancelado" }
        ]
      });
    });        
  }
}
