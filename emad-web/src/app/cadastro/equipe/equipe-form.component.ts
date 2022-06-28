import { Component, OnInit } from '@angular/core';
import { Equipe } from '../../_core/_models/Equipe';
import { FormBuilder } from '@angular/forms';
import { EquipeService } from './equipe.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-equipe-form',
  templateUrl: './equipe-form.component.html',
  styleUrls: ['./equipe-form.component.css'],
  providers: [EquipeService]
})
export class EquipeFormComponent implements OnInit {

  object: Equipe = new Equipe();
  method: string = 'equipe';
  fields = [];
  label: string = "Equipe";
  id: Number = null;
  domains: any[] = [];

  constructor(
    fb: FormBuilder,
    private service: EquipeService,
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

    this.service.list('profissional/estabelecimento/' + JSON.parse(localStorage.getItem("est"))[0].id).subscribe(profissionaisPorEstabelecimento => {
      this.domains.push({
        tipo: [
          { id: 8, nome: "08 - EMSI" },
          { id: 22, nome: "22 - EMAD" },
          { id: 23, nome: "23 - EMAP" },
          { id: 46, nome: "46 - EMAD" },
          { id: 47, nome: "47 - EAD" },
          { id: 70, nome: "70 - eSF" },
          { id: 71, nome: "71 - eSB" },
          { id: 72, nome: "72 - eNASF-AP" },
          { id: 73, nome: "73 - eCR" },
          { id: 74, nome: "74 - eAPP" },
          { id: 75, nome: "75 - eMAESM" },
          { id: 76, nome: "76 - eAP" }],
          profissionais: profissionaisPorEstabelecimento,
          idEstabelecimento: [
            { id: JSON.parse(localStorage.getItem("est"))[0].id, nome: JSON.parse(localStorage.getItem("est"))[0].nomeFantasia }
          ]
      });
    });
  }
}
