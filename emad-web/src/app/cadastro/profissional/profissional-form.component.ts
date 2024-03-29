import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProfissionalService } from './profissional.service';
import { Profissional } from '../../_core/_models/Profissional';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Util } from '../../_core/_util/Util';

@Component({
  selector: 'app-profissional-form',
  templateUrl: './profissional-form.component.html',
  styleUrls: ['./profissional-form.component.css'],
  providers: [ProfissionalService],
})
export class ProfissionalFormComponent implements OnInit {
  object: Profissional = new Profissional();
  method: string = 'profissional';
  fields = [];
  label = 'Profissional';
  id: Number = null;
  domains: any[] = [];
  loading: Boolean = false;
  errors: any[] = [];

  constructor(
    fb: FormBuilder,
    private service: ProfissionalService,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
  ) {
    this.fields = service.fields;
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.id = params['id'];
    });

    this.loadDomains();
  }

  loadDomains() {
    this.service.list('tipo-usuario-profissional').subscribe((tiposUsuario) => {
      this.service
        .listDomains('estabelecimento')
        .subscribe((estabelecimentos) => {
          this.service.listDomains('uf').subscribe((ufs) => {
            this.service.listDomains('nacionalidade').subscribe((paises) => {
              this.service
                .listDomains('especialidade')
                .subscribe((especialidades) => {
                  this.service
                    .listDomains('escolaridade')
                    .subscribe((escolaridade) => {
                      //this.service.listDomains('usuario').subscribe(usuarios => {
                      this.domains.push({
                        idUf: ufs,
                        idNacionalidade: paises,
                        idNaturalidade: [],
                        idMunicipio: [],
                        profissionalSus: [
                          { id: 'N', nome: 'Não' },
                          { id: 'S', nome: 'Sim' },
                        ],

                        idEspecialidade: especialidades,
                        vinculo: [
                          { id: 'A', nome: 'Autônomo' },
                          { id: 'E', nome: 'Empregatício' },
                        ],
                        sexo: [
                          { id: 'F', nome: 'Feminino' },
                          { id: 'M', nome: 'Masculino' },
                        ],
                        idConselho: [
                          {
                            id: 1,
                            nome: 'Conselho Regional de Assistência Social (CRAS)',
                          },
                          {
                            id: 2,
                            nome: 'Conselho Regional de Enfermagem (COREN)',
                          },
                          {
                            id: 3,
                            nome: 'Conselho Regional de Farmácia (CRF)',
                          },
                          {
                            id: 4,
                            nome: 'Conselho Regional de Fonoaudiologia (CRFA)',
                          },
                          {
                            id: 5,
                            nome: 'Conselho Regional de Medicina (CRM)',
                          },
                          {
                            id: 6,
                            nome: 'Conselho Regional de Nutrição (CRN)',
                          },
                          {
                            id: 7,
                            nome: 'Conselho Regional de Odontologia (CRO)',
                          },
                          {
                            id: 8,
                            nome: 'Conselho Regional de Psicologia (CRP)',
                          },
                          { id: 9, nome: 'Outros Conselhos' },
                        ],
                        idUsuario: [], //usuarios,
                        idTipoUsuario: tiposUsuario,
                        estabelecimentos: estabelecimentos,
                        escolaridade: escolaridade,
                        teleatendimento: [
                          { id: 'N', nome: 'Não' },
                          { id: 'S', nome: 'Sim' },
                        ],
                      });
                      this.buscaUsuariosSemProfissional();
                      //});
                    });
                });
            });
          });
        });
    });
  }

  buscaUsuariosSemProfissional() {
    this.loading = true;
    this.service
      .list(
        'usuario/usuario-sem-profissiona  l?id=' +
          (this.id ? this.id : 0) +
          '&idEstabelecimento=' +
          JSON.parse(localStorage.getItem('est'))[0].id,
      )
      .subscribe(
        (result) => {
          this.domains[0].idUsuario = result;
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          this.errors = Util.customHTTPResponse(error);
        },
      );
  }

  getGeocodeAddress(event) {
    const address: any = event.address;
    const object: Profissional = event.object;

    object.logradouro = address.rua;
    object.numero = address.numero;
    object.bairro = address.bairro;
    object.latitude = address.latitude;
    object.longitude = address.longitude;
    object.cep = address.cep;

    let ufs = this.domains[0].idUf.filter(
      (uf) => uf.nome.toUpperCase() == address.estado.toUpperCase(),
    );

    if (ufs.length > 0) {
      object.idUf = ufs[0].id;

      this.service
        .list(`municipio/uf/${object.idUf}`)
        .subscribe((municipios) => {
          this.domains[0].idMunicipio = municipios;
          let ufMunicipios = municipios.filter(
            (uf) =>
              uf.nome.toUpperCase() ==
              address.municipio.toString().toUpperCase(),
          );
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
