import { Component, OnInit } from '@angular/core';
import { Paciente } from '../../_core/_models/Paciente';
import { PacienteService } from './paciente.service';
import { AppNavbarService } from '../../_core/_components/app-navbar/app-navbar.service';

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.css'],
  providers : [PacienteService]
})
export class PacienteComponent implements OnInit {

  method: String = "paciente";
  domains: any[] = [];
  fields = [];
  fieldsSearch = [];
  object: Paciente = new Paciente();

  constructor(
    public nav: AppNavbarService,
    private service: PacienteService) {

    for (let field of this.service.fields) {
      if (field.grid) {
        this.fields.push(field);
      }
      if (field.filter && field.grid) {
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
      this.service.listDomains('especialidade').subscribe(especialidades => {
        this.domains.push({
          estabelecimentos : estabelecimentos,
          idEspecialidade : especialidades
        })

      });

    });
  }

}