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
  method: String = 'equipe';
  fields = [];
  label: String = "Equipe";
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

    this.service.listDomains('estabelecimento').subscribe(estabelecimentos => {
      this.service.listDomains('equipe').subscribe(equipesEmad => {


        this.domains.push({
          idEstabelecimento: estabelecimentos,
          idEquipeEmad: equipesEmad,
          equipe: [
            { id: "EMAD", nome: "EMAD" },
            { id: "EMAP", nome: "EMAP" }
          ],
          tipo: [
            { id: 1, nome: "Tipo 1" },
            { id: 2, nome: "Tipo 2" }
          ],
          profissionais: []
        });
      });
    });

  }

}
