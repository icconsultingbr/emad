import { Component, OnInit } from '@angular/core';
import { Estabelecimento } from '../../_core/_models/Estabelecimento';
import { EstabelecimentoService } from './estabelecimento.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Util } from '../../_core/_util/Util';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TipoFichaService } from '../../cadastro/dominio/tipo-ficha/tipo-ficha.service';
import { each } from 'jquery';

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
  loading: Boolean = false;
  message: string = "";
  errors: any[] = [];
  form: FormGroup;

  selectedItems = [];
  dropdownList = [];
  dropdownSettings: any = {};

  idEstabelecimento: Number = null;

  constructor(
    private fb: FormBuilder,
    private service: EstabelecimentoService,
    private serviceFicha: TipoFichaService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.fields = service.fields;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    this.createGroup();
    this.loadDomains();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'nome',
      selectAllText: 'Marcar todos',
      unSelectAllText: 'Desmarcar todos',
      itemsShowLimit: 5,
      allowSearchFilter: false
    };
    this.listTipoFicha();
  }

  loadDomains() {
    this.service.listDomains('uf').subscribe(ufs => {
      this.service.listDomains('tipo-unidade').subscribe(tipos => {
        this.service.list('estabelecimento/nivel-superior/' + this.id).subscribe(estabelecimentos => {
          this.service.listDomains('especialidade').subscribe(cboProfEsus => {
            this.service.listDomains('tipo-ficha').subscribe(tipoFichas => {
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
                idEstabelecimentoNivelSuperior: estabelecimentos,
                tipoFichas: tipoFichas
              });
              if (!Util.isEmpty(this.id)) {
                this.encontraEstabelecimento();
              }
              else {
                this.loading = false;
              }
            });
          });
        });
      });
    });

  }

  preencher() {

    this.object.cnes = "1231312313123";
    this.object.cnpj = "132123123123123";
    this.object.razaoSocial = "teste1";
    this.object.nomeFantasia = "teste2";
    this.object.cep = "04890100";
    this.object.logradouro = "teste3";
    this.object.numero = "12345";
    this.object.complemento = "123";
    this.object.bairro = "teste4";
    this.object.idMunicipio = 1;
    this.object.idUf = 1;
    this.object.telefone1 = "1159213799";
    this.object.telefone2 = "11983614417";
    this.object.email = "teste@teste.com";
    this.object.cnpjMantedora = "";
    this.object.grauDependencia = "M";
    this.object.terceiros = false;
    this.object.idTipoUnidade = 1;
    this.object.esferaAdministradora = "E";
    this.object.situacao = true;
    this.object.latitude = null;
    this.object.longitude = null;
    this.object.distancia = 3;
    this.object.obrigaCpfNovoPaciente = true;
    this.object.obrigaCartaoSusNovoPaciente = true;
    this.object.obrigaValidarPacienteAtendimento = true;
    this.object.celularDefaultNovoPaciente = null;
    this.object.idUnidadeCorrespondenteDim = 1;
    this.object.idUnidadePesquisaMedicamentoDim = 2;
    this.object.idUnidadeRegistroReceitaDim = 3;
    this.object.cboProfissionalEsus = 2;
    this.object.cnsProfissionaleSus = 212313123123123;
  }

  ngAfterViewInit() {
    this.service.findTipoFichaEstabelecimento(this.id).subscribe(tipoFichas => {
      this.selectedItems = tipoFichas
      this.loading = true;
    });
  }

  sendForm(event) {

    this.errors = [];
    this.message = "";
    this.loading = true;
    event.preventDefault();
    this.service.save(this.object, this.method).subscribe((res: any) => {

      this.loading = false;
      this.object.id = res.id;

      if (this.form.value.id) {
        this.idEstabelecimento = this.form.value.id
        this.message = "Alteração efetuada com sucesso!";
      } else {
        this.idEstabelecimento = res.id
        this.message = "Cadastro efetuado com sucesso!";
      }

      this.createListaFicha(this.idEstabelecimento)
      this.back();
      return;

    }, erro => {
      this.loading = false;
      setTimeout(() => this.loading = false, 300);
      this.errors = Util.customHTTPResponse(erro);
    });
  }

  createListaFicha(idEstabelecimento) {

    this.serviceFicha.deleteFichaEstabelecimento(idEstabelecimento).subscribe((res: any) => {
      if (res) {
        let valor = [];
        for (let field of this.selectedItems) {
          valor.push({
            idTipoFicha: field.id,
            idEstabelecimento: idEstabelecimento
          })
        }
        this.serviceFicha.saveFichaEstabelecimento(valor).subscribe((res: any) => {
          this.loading = false;
        })
      }
    })
  }

  createGroup() {
    this.form = this.fb.group({
      id: [''],
      nome: ['', ''],
      cnes: ['', Validators.required],
      cnpj: ['', Validators.required],
      razaoSocial: ['', Validators.required],
      nomeFantasia: ['', Validators.required],
      cep: ['', Validators.required],
      logradouro: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: ['', ''],
      bairro: ['', Validators.required],
      idMunicipio: ['', Validators.required],
      idUf: ['', Validators.required],
      telefone1: ['', ''],
      telefone2: ['', ''],
      email: ['', ''],
      cnpjMantedora: ['', ''],
      grauDependencia: ['', Validators.required],
      terceiros: ['', Validators.required],
      idTipoUnidade: ['', Validators.required],
      esferaAdministradora: ['', Validators.required],
      situacao: ['', Validators.required],
      latitude: ['', ''],
      longitude: ['', ''],
      distancia: ['', ''],
      idUnidadeCorrespondenteDim: ['', Validators.required],
      idUnidadePesquisaMedicamentoDim: ['', Validators.required],
      idUnidadeRegistroReceitaDim: ['', ''],
      idEstabelecimentoNivelSuperior: ['', ''],
      nivelSuperior: ['', ''],
      obrigaCpfNovoPaciente: ['', ''],
      obrigaCartaoSusNovoPaciente: ['', ''],
      obrigaValidarPacienteAtendimento: ['', ''],
      celularDefaultNovoPaciente: ['', ''],
      cnsProfissionaleSus: ['', Validators.required],
      cboProfissionalEsus: ['', Validators.required],
      tipoFichas: ['', Validators.required],
    });
  }

  back() {
    const route = "estabelecimentos";
    this.router.navigate([route]);
  }

  carregaMunicipios() {
    this.message = "";
    this.errors = [];
    this.loading = true;

    this.service.list(`municipio/uf/${this.object.idUf}`).subscribe(municipios => {
      this.domains[0].idMunicipio = municipios;
      let listaMunicipios = municipios.filter((municipio) => municipio.nome.toUpperCase() == municipio.toString().toUpperCase());
      if (listaMunicipios.length > 0) {
        this.object.idMunicipio = listaMunicipios[0].id;
      }
    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });
  }

  encontraEstabelecimento() {
    this.object.id = this.id;
    this.errors = [];
    this.message = "";
    this.loading = true;

    this.service.findById(this.id, this.method).subscribe(result => {
      this.object = result;
      this.loading = false;
      this.carregaMunicipios();

    }, error => {
      this.object = new Estabelecimento();
      this.loading = false;
      this.errors.push({
        message: "Estabelecimento não encontrado"
      });
    });
  }

  listTipoFicha() {
    this.service.listDomains('tipo-ficha').subscribe(tipoFichas => {
      this.dropdownList = tipoFichas;
    })
  };

  onItemSelect(item: any) {
    this.object.tipoFichas = this.selectedItems;
  }
  onSelectAll(items: any) {
    this.object.tipoFichas = this.selectedItems;
  }
  onChange(item: any) {
  }

}