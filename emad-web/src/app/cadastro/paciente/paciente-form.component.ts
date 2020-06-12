import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PacienteService } from './paciente.service';
import { Paciente } from '../../_core/_models/Paciente';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-paciente-form',
  templateUrl: './paciente-form.component.html',
  styleUrls: ['./paciente-form.component.css'],
  providers : [PacienteService]
})
export class PacienteFormComponent implements OnInit {
  object: Paciente = new Paciente();
  method: String = 'paciente';
  fields = [];
  label: String = "Paciente";
  id: Number = null;
  domains: any[] = [];

  constructor(
    fb: FormBuilder,
    private service: PacienteService,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef) {
    this.fields = service.fields;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });

    this.loadDomains();
  }

  loadDomains() {
    this.service.listDomains('uf').subscribe(ufs => {
      this.service.listDomains('nacionalidade').subscribe(paises => {
        this.service.listDomains('modalidade').subscribe(modalidades => {
          this.service.listDomains('raca').subscribe(racas => {
            this.service.listDomains('atencao-continuada').subscribe(atencaoContinuada => {
              this.domains.push({
                idUf: ufs,
                idNacionalidade: paises,
                idNaturalidade: [],
                idMunicipio: [],

                escolaridade: [
                  { id: 1, nome: "Educação infantil" },
                  { id: 2, nome: "Fundamental" },
                  { id: 3, nome: "Médio" },
                  { id: 4, nome: "Superior (Graduação)" },
                  { id: 5, nome: "Pós-graduação" },
                  { id: 6, nome: "Mestrado" },
                  { id: 7, nome: "Doutorado" },
                  { id: 8, nome: "Escola" }
                ],
                idModalidade: modalidades,
                sexo: [
                  { id: "1", nome: "Masculino" },
                  { id: "2", nome: "Feminino" },
                  { id: "3", nome: "Ambos" },
                  { id: "4", nome: "Não informado" }
                ],
                idTipoSanguineo: [
                  { id: "1", nome: "A_POSITIVO" },
                  { id: "2", nome: "A_NEGATIVO" },
                  { id: "3", nome: "B_POSITIVO" },
                  { id: "4", nome: "B_NEGATIVO" },
                  { id: "5", nome: "AB_POSITIVO" },
                  { id: "6", nome: "AB_NEGATIVO" },
                  { id: "7", nome: "O_POSITIVO" },
                  { id: "8", nome: "O_NEGATIVO" },
                ],
                idRaca: racas,
                idAtencaoContinuada: atencaoContinuada
              });
            });
          });
        });
      });
    });
  }

  getGeocodeAddress(event) {
    let address: any = event.address;
    let object: Paciente = event.object;

    object.logradouro = address.rua;
    object.numero = address.numero;
    object.bairro = address.bairro;
    object.latitude = address.latitude;
    object.longitude = address.longitude;
    object.cep = address.cep;

    let ufs = this.domains[0].idUf.filter((uf) => uf.nome.toUpperCase() == address.estado.toUpperCase());

    if (ufs.length > 0) {
      object.idUf = ufs[0].id;
      
      this.service.list(`municipio/uf/${object.idUf}`).subscribe(municipios => {
        this.domains[0].idMunicipio = municipios;
        let ufMunicipios = municipios.filter((uf) => uf.nome.toUpperCase() == address.municipio.toUpperCase());
        if (ufMunicipios.length > 0) {
          object.idMunicipio = ufMunicipios[0].id;
        }
        this.ref.detectChanges();
      });
    }

    this.object = object;
    this.ref.detectChanges();    
  }

}
