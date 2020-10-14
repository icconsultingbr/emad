import { Component, OnInit, ChangeDetectorRef, ViewChild, Output, ElementRef, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { PacienteService } from './paciente.service';
import { Paciente } from '../../_core/_models/Paciente';
import { ActivatedRoute, Router } from '@angular/router';
import { Util } from '../../_core/_util/Util';
import PlaceResult = google.maps.places.PlaceResult;
import PlaceGeometry = google.maps.places.PlaceGeometry;
import GeocoderAddressComponent = google.maps.GeocoderAddressComponent;
import { environment } from '../../../environments/environment';
import { PacienteHipotese } from '../../_core/_models/PacienteHipotese';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-paciente-form',
  templateUrl: './paciente-form.component.html',
  styleUrls: ['./paciente-form.component.css'],
  providers: [PacienteService]
})
export class PacienteFormComponent implements OnInit {
  object: Paciente = new Paciente();
  pacienteHipotese: PacienteHipotese = new PacienteHipotese();
  method: string = 'paciente';
  fields = [];
  label: string = "Paciente";
  id: number = null;
  domains: any[] = [];
  form: FormGroup;
  loading: Boolean = false;
  message: string = "";
  errors: any[] = [];
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  allItemsHipotese: any[] = [];
  virtualDirectory: string = environment.virtualDirectory != "" ? environment.virtualDirectory + "/" : "";
  modalRef: NgbModalRef = null;
  loadPhoto: boolean = false;

  @ViewChild('addresstext') addresstext: ElementRef;

  constructor(
    private service: PacienteService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private ref: ChangeDetectorRef,
    private modalService: NgbModal,
    private router: Router) {
    this.fields = service.fields;
  }

  ngOnInit() {

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'nome',
      selectAllText: 'Marcar todos',
      unSelectAllText: 'Desmarcar todos',
      searchPlaceholderText: 'Procurar',
      noDataAvailablePlaceholderText: 'Sem dados disponíveis',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    this.createGroup();
    this.loadDomains();
  }

  ngAfterViewInit() {
    this.getPlaceAutocomplete();
  }

  loadDomains() {
    this.loading = true;
    this.service.listDomains('uf').subscribe(ufs => {
      this.service.listDomains('nacionalidade').subscribe(paises => {
        this.service.listDomains('modalidade').subscribe(modalidades => {
          this.service.listDomains('estabelecimento').subscribe(estabelecimentos => {
            this.service.listDomains('raca').subscribe(racas => {
              this.service.listDomains('hipotese-diagnostica').subscribe(hipoteseDiagnostica => {
                this.service.listDomains('atencao-continuada').subscribe(atencaoContinuada => {
                  this.domains.push({
                    idUf: ufs,
                    idNacionalidade: paises,
                    idNaturalidade: [],
                    idMunicipio: [],
                    hipoteses: hipoteseDiagnostica,
                    idEstabelecimentoCadastro: estabelecimentos,
                    escolaridade: [
                      { id: 1, nome: "Educação infantil" },
                      { id: 2, nome: "Fundamental" },
                      { id: 3, nome: "Médio" },
                      { id: 4, nome: "Superior (Graduação)" },
                      { id: 5, nome: "Pós-graduação" },
                      { id: 6, nome: "Mestrado" },
                      { id: 7, nome: "Doutorado" },
                      { id: 8, nome: "Escola" },
                      { id: 9, nome: "Analfabeto" },
                      { id: 10, nome: "Não informado" }
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
                    idAtencaoContinuada: atencaoContinuada,
                    gruposAtencaoContinuada: atencaoContinuada,
                  });
                  if (!Util.isEmpty(this.id)) {
                    this.encontraPaciente();
                  }
                  else {
                    this.loading = false;
                    this.loadPhoto = true;
                  }
                });
              });
            });
          });
        });
      });
    });
  }

  encontraPaciente() {
    this.object.id = this.id;
    this.errors = [];
    this.message = "";
    this.loading = true;

    this.service.findById(this.id, this.method).subscribe(result => {
      this.object = result;
      this.loading = false;
      this.loadPhoto = true;
      this.carregaNaturalidade();
      this.findHipotesePorPaciente();
    }, error => {
      this.object = new Paciente();
      this.loading = false;
      this.loadPhoto = true;
      //this.allItemsEncaminhamento = [];
      this.allItemsHipotese = [];
      //this.allItemsMedicamento = [];
      this.errors.push({
        message: "Paciente não encontrado"
      });
    });
  }

  carregaNaturalidade() {
    this.loading = true;
    this.service.carregaNaturalidadePorNacionalidade(this.object.idNacionalidade).subscribe(result => {
      this.domains[0].idNaturalidade = result;
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }

  back() {
    const route = "pacientes";
    this.router.navigate([route]);
  }

  createGroup() {
    this.form = this.fb.group({
      id: [''],
      cartaoSus: ['', ''],
      nome: ['', Validators.required],
      nomeSocial: ['', ''],
      apelido: ['', ''],
      nomeMae: ['', Validators.required],
      nomePai: ['', ''],
      dataNascimento: ['', Validators.required],
      sexo: ['', Validators.required],
      idNacionalidade: ['', Validators.required],
      idNaturalidade: ['', Validators.required],
      ocupacao: ['', ''],
      cpf: ['', ''],
      rg: ['', ''],
      dataEmissao: ['', ''],
      orgaoEmissor: ['', ''],
      escolaridade: ['', Validators.required],
      cep: ['', ''],
      logradouro: ['', ''],
      numero: ['', ''],
      complemento: ['', ''],
      bairro: ['', ''],
      idMunicipio: ['', ''],
      idUf: ['', ''],
      foneResidencial: ['', ''],
      foneCelular: ['', ''],
      foneContato: ['', ''],
      contato: ['', ''],
      email: ['', ''],
      idModalidade: ['', ''],
      latitude: ['', ''],
      longitude: ['', ''],
      idSap: ['', ''],
      idTipoSanguineo: ['', ''],
      idRaca: ['', ''],
      numeroProntuario: ['', ''],
      numeroProntuarioCnes: ['', ''],
      idAtencaoContinuada: ['', ''],
      historiaProgressaFamiliar: ['', ''],
      observacao: ['', ''],
      idEstabelecimentoCadastro: new FormControl({ value: '', disabled: (this.id > 0 || this.object.id > 0) ? true : false }, Validators.required),
      gruposAtencaoContinuada: ['', ''],
      falecido: ['', ''],
      situacao: ['', Validators.required],
      foto: ['']
    });
  }

  sendForm(event) {
    this.errors = [];
    this.message = "";
    this.loading = true;
    event.preventDefault();

    this.service
      .save(this.object, this.method)
      .subscribe((res: any) => {
        this.loading = false;
        this.object.id = res.id;
        if (this.form.value.id)
          this.message = "Alteração efetuada com sucesso!";
        else
          this.message = "Cadastro efetuado com sucesso!";

        this.back();
        return;



        // if(res.ano_receita)
        //   this.object.ano_receita = res.ano_receita;

        // if(res.numeroReceita)
        //   this.object.numero_receita = res.numeroReceita;

        // if(res.idEstabelecimento)
        //   this.object.unidade_receita = res.idEstabelecimento;

        // if(res.dadosFicha)
        //   this.object.dadosFicha = res.dadosFicha;



        //   if(!Util.isEmpty(this.object.ano_receita) && !Util.isEmpty(this.object.numero_receita) && !Util.isEmpty(this.object.unidade_receita))
        //     this.abreReceitaMedica(this.object.ano_receita, this.object.numero_receita, this.object.unidade_receita);
        // } else {
        //   this.abreFichaDigital(this.object.id, false);
        // }



        // if(this.object.situacao && this.object.situacao != "E" && this.object.situacao != "O" && this.object.situacao != "X" && this.object.situacao != "C"){
        //   this.stopProcess(this.object.situacao);
        //   return;
        // }

      }, erro => {
        this.loading = false;
        setTimeout(() => this.loading = false, 300);
        this.errors = Util.customHTTPResponse(erro);
      });
  }

  private getPlaceAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(
      this.addresstext.nativeElement,
      {
        componentRestrictions: { country: 'BR' },
        types: ['geocode']  // 'establishment' / 'address' / 'geocode'
      }
    );

    // Set the data fields to return when the user selects a place.
    autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);

    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      let place: PlaceResult = autocomplete.getPlace();
      let geometry: PlaceGeometry = place.geometry;

      let rua: string = "";
      let numero: string = "";
      let bairro: string = "";
      let municipio: string = "";
      let estado: string = "";
      let latitude: number = 0;
      let longitude: number = 0;
      let cep: string = "";

      place.address_components.forEach((address_component: GeocoderAddressComponent) => {
        if (address_component.types[0] === "route") {
          rua = address_component.long_name;
        }
        if (address_component.types[0] === "street_number") {
          numero = address_component.long_name;
        }
        if (address_component.types[0] === "sublocality_level_1") {
          bairro = address_component.long_name;
        }
        if (address_component.types[0] === "administrative_area_level_2") {
          municipio = address_component.long_name;
        }
        if (address_component.types[0] === "administrative_area_level_1") {
          estado = address_component.long_name;
        }
        if (address_component.types[0] === "postal_code") {
          cep = address_component.long_name;
        }
      });

      if (geometry) {
        latitude = geometry.location.lat();
        longitude = geometry.location.lng();
      }

      this.object.logradouro = rua;
      this.object.numero = numero;
      this.object.bairro = bairro;
      this.object.latitude = latitude;
      this.object.longitude = longitude;
      this.object.cep = cep;

      let ufs = this.domains[0].idUf.filter((uf) => uf.nome.toUpperCase() == estado.toUpperCase());

      if (ufs.length > 0) {
        this.object.idUf = ufs[0].id;

        this.service.list(`municipio/uf/${this.object.idUf}`).subscribe(municipios => {
          this.domains[0].idMunicipio = municipios;
          let ufMunicipios = municipios.filter((uf) => uf.nome.toUpperCase() == municipio.toUpperCase());
          if (ufMunicipios.length > 0) {
            this.object.idMunicipio = ufMunicipios[0].id;
          }
          this.ref.detectChanges();
        });
      }
    });
  }

  findHipotesePorPaciente() {
    this.message = "";
    this.errors = [];
    this.loading = true;
    this.service.findHipoteseByPaciente(this.object.id).subscribe(result => {
      this.allItemsHipotese = result;
      this.loading = false;
    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });
  }

  visualizaAtendimentos(id: any): void {
    let url = this.router.url.replace('paciente', '') + this.virtualDirectory + "#/atendimentos/cadastro/" + id;
    this.service.file('atendimento/consulta-por-paciente', url).subscribe(result => {
      this.loading = false;
      window.open(
        url,
        '_blank'
      );
    });
  }

  openHipotese(content: any) {
    this.errors = [];
    this.message = "";
    this.pacienteHipotese = new PacienteHipotese();
    this.pacienteHipotese.idPaciente = this.object.id;
    this.pacienteHipotese.idAtendimento = null;

    this.modalRef = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: "lg"
    });
  }

  close() {
    if (this.modalRef)
      this.modalRef.close();
  }

  saveHipotese() {
    this.message = "";
    this.errors = [];
    this.loading = true;
    this.pacienteHipotese.funcionalidade = 'PACIENTE';
    this.service.saveHipotese(this.pacienteHipotese).subscribe(result => {
      this.message = "Hipótese diagnóstica inserida com sucesso!"
      this.close();
      this.loading = false;
      this.findHipotesePorPaciente();
    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });
  }

  removeHipotese(item) {
    this.service.removeHipotese(item.id).subscribe(result => {
      this.message = "Hipótese diagnóstica removida com sucesso!"
      this.close();
      this.loading = false;
      this.findHipotesePorPaciente();
    });
  }

  photoSaved(id: string){
    this.form.patchValue({ foto: id }, { emitEvent: false });
    this.object.foto = id;
  }
}
