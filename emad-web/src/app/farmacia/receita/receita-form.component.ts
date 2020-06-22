import { Component, OnInit } from '@angular/core';
import { ReceitaService } from './receita.service';
import { Receita } from '../../_core/_models/Receita';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-receita-form',
    templateUrl: './receita-form.component.html',
    styleUrls: ['./receita-form.component.css'],
    providers: [ReceitaService]
})

export class ReceitaFormComponent implements OnInit {

  object: Receita = new Receita();
  method: String = "receita";
  fields: any[] = [];
  label: String = "Receita";
  id: Number = null;
  domains: any[] = [];

  constructor(
    fb: FormBuilder,
    private service: ReceitaService,
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
    this.service.listDomains('estabelecimento').subscribe(estabelecimento => {      
        this.service.listDomains('profissional').subscribe(profissional => {          
            this.service.listDomains('subgrupo-origem').subscribe(subgrupoOrigem => {              
                this.service.listDomains('uf').subscribe(ufs => {
                  this.domains.push({            
                    idEstabelecimento: estabelecimento,
                    idUf: ufs,
                    idMunicipio: [],
                    idProfissional: profissional,                    
                    idSubgrupoOrigem: subgrupoOrigem,    
                    idPacienteOrigem: [],
                    idMandadoJudicial: [],
                    idMotivoFimReceita: [],
                    idPaciente: []
              });                      
            });                      
          });                      
        });                                
      });                          
  }    
}