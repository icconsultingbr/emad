import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Estabelecimento } from '../../_core/_models/Estabelecimento';
import { FormBuilder } from '@angular/forms';
import { EstabelecimentoService } from './estabelecimento.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-estabelecimento-form',
  templateUrl: './estabelecimento-form.component.html',
  styleUrls: ['./estabelecimento-form.component.css']
})
export class EstabelecimentoFormComponent implements OnInit {

  object: Estabelecimento = new Estabelecimento();
  method: string = 'estabelecimento';
  fields = [];
  label: string = "Estabelecimento";
  id: Number = null;
  domains: any[] = [];

  constructor(
    fb: FormBuilder,
    private service: EstabelecimentoService,
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
      this.service.listDomains('tipo-unidade').subscribe(tipos => {  
        this.service.list('estabelecimento/nivel-superior/' + this.id).subscribe(estabelecimentos => {
          this.service.listDomains('especialidade').subscribe(cboProfEsus => {
          this.domains.push({
            idUf: ufs,
            idMunicipio: [],
            cboProfissionalEsus: cboProfEsus,
            idTipoUnidade: tipos,
            grauDependencia: [
              { id: "I", nome: "Individual" },
              { id: "M", nome: "Mantida" }
            ],
            esferaAdministradora: [
              { id: "E", nome: "Estadual" },
              { id: "F", nome: "Federal" },
              { id: "M", nome: "Municipal" }
            ],
            idEstabelecimentoNivelSuperior: estabelecimentos
          });
        });
      });
    });
  });
}
  
  getGeocodeAddress(event) {
    let address: any = event.address;
    let object: Estabelecimento = event.object;

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