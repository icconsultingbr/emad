import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProfissionalService } from './profissional.service';
import { Profissional } from '../../_core/_models/Profissional';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profissional-form',
  templateUrl: './profissional-form.component.html',
  styleUrls: ['./profissional-form.component.css'],
  providers: [ProfissionalService]
})
export class ProfissionalFormComponent implements OnInit {

  object: Profissional = new Profissional();
  method: String = 'profissional';
  fields = [];
  label: String = "Profissional";
  id: Number = null;
  domains: any[] = [];

  constructor(
    fb: FormBuilder,
    private service: ProfissionalService,
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
        this.service.listDomains('especialidade').subscribe(especialidades => {
          this.service.listDomains('estabelecimento').subscribe(estabelecimentos => {

            this.domains.push({
              idUf: ufs,
              idNacionalidade: paises,
              idNaturalidade: [],
              idMunicipio: [],
              profissionalSus: [
                { id: "N", nome: "Não" },
                { id: "S", nome: "Sim" },
              ],
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
              idEspecialidade: especialidades,
              vinculo: [
                { id: "A", nome: "Autônomo" },
                { id: "E", nome: "Empregatício" }
              ],
              estabelecimentos: estabelecimentos,
              sexo: [
                { id: "F", nome: "Feminino" },
                { id: "M", nome: "Masculino" }
              ]
            });
          });
        });
      });
    });
  }

  getGeocodeAddress(event) {
    let address: any = event.address;
    let object: Profissional = event.object;

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