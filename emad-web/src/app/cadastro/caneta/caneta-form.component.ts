import { Component, OnInit } from '@angular/core';
import { Caneta } from '../../_core/_models/Caneta';
import { FormBuilder } from '@angular/forms';
import { CanetaService } from './caneta.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-caneta-form',
  templateUrl: './caneta-form.component.html',
  styleUrls: ['./caneta-form.component.css'],
  providers: [CanetaService]
})
export class CanetaFormComponent implements OnInit {

  object: Caneta = new Caneta();
  method: String = 'caneta';
  fields = [];
  label: String = "Caneta";
  id: Number = null;
  domains: any[] = [];

  constructor(
    fb: FormBuilder,
    private service: CanetaService,
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
        this.domains.push({
          idEstabelecimento: estabelecimentos,          
          modelo: [
            { id: 1, nome: "DP 201" },
            { id: 2, nome: "Anoto Live Pen 2" }
          ]
        });      
    });

  }

}
