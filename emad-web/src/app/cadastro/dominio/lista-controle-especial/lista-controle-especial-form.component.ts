import { Component, OnInit } from '@angular/core';
import { ListaControleEspecialService } from './lista-controle-especial.service';
import { ListaControleEspecial } from '../../../_core/_models/ListaControleEspecial';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-lista-controle-especial-form',
    templateUrl: './lista-controle-especial-form.component.html',
    styleUrls: ['./lista-controle-especial-form.component.css'],
    providers: [ListaControleEspecialService]
})

export class ListaControleEspecialFormComponent implements OnInit {

  object: ListaControleEspecial = new ListaControleEspecial();
  method = 'lista-controle-especial';
  fields: any[] = [];
  label = 'Lista de controle especial';
  id: Number = null;
  domains: any[] = [];

  constructor(
    fb: FormBuilder,
    private service: ListaControleEspecialService,
    private route: ActivatedRoute) {
      this.fields = service.fields;
    }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });

    this.loadDomains();
  }

  loadDomains() {
    this.service.listDomains('livro').subscribe(livro => {
      this.domains.push({
        idLivro: livro
      });
    });
  }

}
