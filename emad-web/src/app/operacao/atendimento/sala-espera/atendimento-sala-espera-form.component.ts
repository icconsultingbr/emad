import { Component, OnInit, ViewChild } from '@angular/core';
import { AtendimentoService } from '.././atendimento.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { PagerService } from '../../../_core/_services';
import { Router, ActivatedRoute } from '@angular/router';
import { Atendimento, AtendimentoHistorico } from '../../../_core/_models/Atendimento';
import { Paciente } from '../../../_core/_models/Paciente';
import { Util } from '../../../_core/_util/Util';
import { PlanoTerapeuticoService } from '../../plano-terapeutico/plano-terapeutico.service';
import { PacienteHipotese } from '../../../_core/_models/PacenteHipotese';
import { Encaminhamento } from '../../../_core/_models/Encaminhamento';
import { AtendimentoMedicamento } from '../../../_core/_models/AtendimentoMedicamento';
import { Material } from '../../../_core/_models/Material';
import { ReciboReceitaImpressaoService } from '../../../shared/services/recibo-receita-impressao.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-atendimento-sala-espera-form',
  templateUrl: './atendimento-sala-espera-form.component.html',
  styleUrls: ['./atendimento-sala-espera-form.component.css'],
  providers: [AtendimentoService, PlanoTerapeuticoService]
})
export class AtendimentoSalaEsperaFormComponent implements OnInit {
  
  @ViewChild('contentConfirmacao') contentConfirmacao: any;
  
  loading: Boolean = false;
  message: string = "";
  errors: any[] = [];
  modalRef: NgbModalRef = null;

  //FORMS
  form: FormGroup;
  formHistorico: FormGroup;
  formHipotese: FormGroup;
  formMedicamento: FormGroup;

  method: string = "atendimento";
  url: string = "atendimentos/sala-espera";
  object: Atendimento = new Atendimento();
  objectHistorico: AtendimentoHistorico = new AtendimentoHistorico(); 
  paciente: Paciente = new Paciente();
  pacienteHipotese: PacienteHipotese = new PacienteHipotese();
  encaminhamento: Encaminhamento = new Encaminhamento();
  atendimentoMedicamento: AtendimentoMedicamento = new AtendimentoMedicamento();
  medicamento: Material = new Material();
  virtualDirectory: string = environment.virtualDirectory != "" ? environment.virtualDirectory + "/" : "";
  atendimentoHistorico: AtendimentoHistorico = new AtendimentoHistorico(); 
  mostraFormulario: boolean = false;
  pacienteSelecionado: any = null;
  medicamentoSelecionado: any = null;
  domains: any[] = [];
  allItemsEntidadeCampo: any[] = null;

  //PAGINATION
  allItems: any[] = [];
  pager: any = {};
  pagedItems: any[];
  pageLimit: number = 10;
  fieldsPacientes: any[] = [];

  allItemsHipotese: any[] = [];
  allItemsEncaminhamento: any[] = [];
  allItemsMedicamento: any[] = [];
  allMedicamentos: any[] = [];
  removeId: number;

  paging: any = {
    offset: 0,
    limit: 10,
    total: 0
  };  
  warning: string = "";    
  totalPages: Number;

  id: number;
  idHistorico: number;
  dataHistorico: string;
  nomeProfissional: string;
  nomeTipoHistorico: string;

  constructor(
    private service: AtendimentoService,
    private pagerService: PagerService,
    private pacienteService: PlanoTerapeuticoService,
    private reciboReceitaService: ReciboReceitaImpressaoService,
    private fb: FormBuilder,
    private fbHipotese: FormBuilder,
    private fbMedicamento: FormBuilder,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router) {

    for (let field of this.pacienteService.fields) {
      if (field.grid) {
        this.fieldsPacientes.push(field);
      }
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.idHistorico = params['idHistorico'];  
      this.object.situacao = "0";
      this.carregaEntidadeCampoPorEspecialidade();
    });
  }

  createGroup() {
    this.form = this.fb.group({
      id: [''],
      idPaciente: [Validators.required],
      pacienteNome: [Validators.required],
      pacienteHistoriaProgressa: ['', ''],
      pressaoArterial: ['', ''],
      pulso: ['', ''],
      saturacao: ['', ''],
      temperatura: ['', ''],
      altura: ['', ''],
      peso: ['', ''],
      historicoClinico: ['', ''],
      exameFisico: ['', ''],
      observacoesGerais: ['', ''],
      situacao: new FormControl({value: '0', disabled: true}),
      motivoCancelamento: ['',''],
      idEstabelecimento: [Validators.required],
      tipoFicha: ['', Validators.required],
      idClassificacaoRisco: ['', Validators.required],
      motivoQueixa: ['', Validators.required],
      tipoHistoriaClinica: ['', ''],
    });

    this.formHipotese = this.fbHipotese.group({
      idPaciente: [Validators.required],
      idHipoteseDiagnostica: [Validators.required]
    });

    this.formMedicamento = this.fbMedicamento.group({
      idPaciente: [Validators.required],
      uso: [Validators.required],
      tipoVia: [Validators.required],
      quantidade: [Validators.required],
      apresentacao: [Validators.required],
      posologia: [Validators.required],
    });
  }

  createGroupHistorico() {
    this.formHistorico = this.fb.group({
      pacienteHistoriaProgressa: new FormControl({value: '', disabled: true}),
      pressaoArterial: new FormControl({value: '', disabled: true}),
      pulso: new FormControl({value: '', disabled: true}),
      saturacao: new FormControl({value: '', disabled: true}),
      temperatura: new FormControl({value: '', disabled: true}),
      altura: new FormControl({value: '', disabled: true}),
      peso: new FormControl({value: '', disabled: true}),
      historicoClinico: new FormControl({value: '', disabled: true}),
      exameFisico: new FormControl({value: '', disabled: true}),
      observacoesGerais: new FormControl({value: '', disabled: true}),
      situacao: new FormControl({value: '', disabled: true}),
      motivoCancelamento:  new FormControl({value: '', disabled: true}),      
      tipoFicha: new FormControl({value: '', disabled: true}),
      idClassificacaoRisco: new FormControl({value: '', disabled: true}),
      motivoQueixa: new FormControl({value: '', disabled: true}),
      tipoHistoriaClinica: new FormControl({value: '', disabled: true}),
    });

    this.formHipotese = this.fbHipotese.group({
      idPaciente: [Validators.required],
      idHipoteseDiagnostica: [Validators.required]
    });

    this.formMedicamento = this.fbMedicamento.group({
      idPaciente: [Validators.required],
      uso: [Validators.required],
      tipoVia: [Validators.required],
      quantidade: [Validators.required],
      apresentacao: [Validators.required],
      posologia: [Validators.required],
    });
  }

  buscaPaciente(offset: Number = null, limit: Number = null) {
    this.loading = true;
    let params = "pesquisa=1&";
    
    this.paging.offset = offset ? offset : 0;
    this.paging.limit = limit ? limit : 10;

    if (!Util.isEmpty(this.paciente)) {
      if (Object.keys(this.paciente).length) {
        for (let key of Object.keys(this.paciente)) {
          if (!Util.isEmpty(this.paciente[key])) {
            params += key + "=" + this.paciente[key] + "&";
          }
        }

        if (params != "") {
          params = "?" + params;
        }
      }
    }   

    if (this.paging.offset != null && this.paging.limit != null) {
      params += (params == "" ? "?" : "") + "offset=" + this.paging.offset + "&limit=" + this.paging.limit;
    }

    this.service.list('paciente' + params).subscribe(result => {      
      this.paging.total = result.total;
      this.totalPages = Math.ceil((this.paging.total / this.paging.limit));
      this.allItems = result.items;
      setTimeout(() => {
        this.loading = false;
      }, 300);
    }, erro => {
      setTimeout(() => this.loading = false, 300);
      this.errors = Util.customHTTPResponse(erro);
    });
  }

  open(content: any) {
    this.clear();
    this.pacienteSelecionado = null;

    this.allItems = [];

    this.modalRef = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      windowClass: 'modal-gg'
    });
  }

  openHistorico(content: any, idHistorico: number) {
    this.createGroupHistorico();
    this.encontraAtendimentoHistorico(idHistorico);
    this.modalRef = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      windowClass: 'modal-gg'
    });
  }

  setPage(page: number) {
    this.pager = this.pagerService.getPager(this.allItems.length, page, this.pageLimit);
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  loadQuantityPerPage(event) {
    let id = parseInt(event.target.value);
    this.pageLimit = id;
    this.setPage(1);
  }

  clear() {
    this.paciente = new Paciente();
    this.paciente.cartaoSus = "";
    this.allItems = [];
  }

  togglePaciente() {
    return Util.isEmpty(this.paciente.cartaoSus) && Util.isEmpty(this.paciente.nome) && Util.isEmpty(this.paciente.idSap);
  }

  selecionaPaciente(item) {
    this.pacienteSelecionado = item;
  }

  confirmaPaciente() {
    this.object.idPaciente = this.pacienteSelecionado.id;
    this.object.pacienteNome = this.pacienteSelecionado.nome;
    this.object.pacienteHistoriaProgressa = this.pacienteSelecionado.historiaProgressaFamiliar;
    this.close();

    this.findPacienteData(this.object.idPaciente);
  }

  encontraAtendimento() {
    this.object.id = this.id;
    this.errors = [];
    this.message = "";
    this.loading = true;

    this.service.findById(this.id, this.method).subscribe(result => {
      this.object = result;
      this.object.pacienteNome = result.nome;
      this.object.pacienteHistoriaProgressa = result.pacienteHistoriaProgressa;
      this.loading = false;
      this.findHistoricoPorAtendimento();

    }, error => {
      this.object = new Atendimento();
      this.object.situacao = "0";
      this.object.idPaciente = this.pacienteSelecionado.id;
      this.object.pacienteNome = this.pacienteSelecionado.nome;
      this.object.pacienteHistoriaProgressa = this.pacienteSelecionado.historiaProgressaFamiliar;
      this.loading = false;

      this.allItemsEncaminhamento = [];
      this.allItemsHipotese = [];
      this.allItemsMedicamento = [];

      this.errors.push({
        message: "Atendimento não encontrado"
      });
    });    
  }

  findHistoricoPorAtendimento() {
    this.message = "";
    this.errors = [];
    this.loading = true;
    this.service.findHistoricoByAtendimento(this.object.id).subscribe(result => {
      this.atendimentoHistorico = result;
      this.loading = false;
    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });
  }

  encontraAtendimentoHistorico(idHistorico: number) {
    this.object.id = this.id;
    this.errors = [];
    this.message = "";
    
    if(idHistorico){      
    this.loading = true;
      this.service.findByHistoricoId(idHistorico).subscribe(result => {
        this.objectHistorico = result;
        this.dataHistorico = result.dataHistorico;
        this.nomeProfissional = result.nomeProfissional;
        this.nomeTipoHistorico = result.nomeTipoHistorico;
        this.objectHistorico.pacienteHistoriaProgressa = result.pacienteHistoriaProgressa;
        this.loading = false;
  
      }, error => {  
        this.loading = false;
        this.close();
        this.errors.push({
          message: "Atendimento histórico não encontrado"
        });
      });
    }       
  }

  sendForm(event) {
    this.errors = [];
    this.message = "";
    this.loading = true;
    event.preventDefault();

    this.service
      .save(this.form.getRawValue(), this.method)
      .subscribe((res: any) => {
        this.object.id = res.id;

        if(res.dadosFicha)
          this.object.dadosFicha = res.dadosFicha;

        this.abreFichaDigital(this.object.id, false);
        this.message = "Cadastro efetuado com sucesso!";
        this.back();
        this.loading = false;        
      }, erro => {
        setTimeout(() => this.loading = false, 300);
        this.errors = Util.customHTTPResponse(erro);
      });
  }

  atribuir() {
    this.errors = [];
    this.message = "";
    this.loading = true;

    this.service
      .atribuirAtendimento(this.form.getRawValue())
      .subscribe((res: any) => {
        this.object.id = res.id;
        if(res.dadosFicha)
          this.object.dadosFicha = res.dadosFicha;
        this.abreFichaDigital(this.object.id, false);        
        this.back();
        this.loading = false;        
      }, erro => {
        setTimeout(() => this.loading = false, 300);
        this.errors = Util.customHTTPResponse(erro);
      });
  }  

  findPacienteData(idPaciente) {
    this.errors = [];
    this.message = "";
    this.loading = true;
    this.service.findByIdPaciente(idPaciente, this.object.idEstabelecimento, this.method).subscribe(result => {

      if(result){
        this.object = result;
        this.object.pacienteNome = this.pacienteSelecionado.nome;
        this.object.pacienteHistoriaProgressa = this.pacienteSelecionado.historiaProgressaFamiliar;
        this.loading = false;
      }
      else
        this.limpaAtendimento();
    }, error => {
      this.limpaAtendimento();
    });
  }

  limpaAtendimento(){
    this.object = new Atendimento();
    this.object.situacao = "0";
    this.object.idPaciente = this.pacienteSelecionado.id;
    this.object.pacienteNome = this.pacienteSelecionado.nome;
    this.object.pacienteHistoriaProgressa = this.pacienteSelecionado.historiaProgressaFamiliar;
    this.loading = false;

    this.allItemsEncaminhamento = [];
    this.allItemsHipotese = [];
    this.allItemsMedicamento = [];

    this.errors.push({
      message: "Atendimento não encontrado"
    });
  }

  close() {
    if(this.modalRef)
      this.modalRef.close();
  }

  loadDomains() {
    this.loading = true;
    this.service.listDomains('hipotese-diagnostica').subscribe(hipoteses => {
      this.service.listDomains('especialidade').subscribe(especialidades => {            
        this.service.listDomains('tipo-ficha').subscribe(tipoFichas => {            
          this.service.listDomains('grupo-material').subscribe(gruposMateriais => {  
            this.service.listDomains('classificacao-risco').subscribe(classificacaoRiscos => {            
                this.domains.push({
                  hipoteses: hipoteses,
                  especialidades: especialidades,
                  tipoFichas: tipoFichas,
                  classificacaoRiscos:classificacaoRiscos,
                  idGrupoMaterial: gruposMateriais,
                  tipoHistoriaClinica: [
                    { id: 1, nome: "Anamnese" },
                    { id: 2, nome: "Evolução" },
                  ],
              });
            if (!Util.isEmpty(this.id)) {
              this.encontraAtendimento();
            }
            else
              this.loading = false;
            });
          });
        });
      });
    });
  }
  
  disableFields(): boolean {
    if (!this.object) {
      return true;
    } else {
      if (Util.isEmpty(this.object.dataFinalizacao) && Util.isEmpty(this.object.dataCancelamento)) {
        return false;
      } else {
        return true;
      }
    }
  }

  back() {
    if(this.modalRef)
      this.modalRef.close();

    this.router.navigate([this.url]);    
  }

  abreHistorico(id: Number) {
    if(!id)
      return;

    let url = this.router.url.replace('atendimentos/cadastro/'+this.id,'') +  this.virtualDirectory + "#/atendimentos/historico/" + id;  

    this.loading = true;
    this.service.printDocument(url).subscribe(result => {
      this.loading = false;
      window.open(
        url,
        '_blank'
      );
    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });
  }

  abreFichaDigital(id: Number, grid: boolean) {
    if((!this.object.dadosFicha || this.object.dadosFicha.length == 0) && !grid)
      return;
      
    this.errors = [];
    let url = 
      JSON.parse(localStorage.getItem("parametro_seguranca")).filter((url) => url.nome == "URL_FICHA_MEDICA_IMPRESSAO")
      ?
      JSON.parse(localStorage.getItem("parametro_seguranca")).filter((url) => url.nome == "URL_FICHA_MEDICA_IMPRESSAO")[0].valor.replace('{id}', id)
      :"";
    this.loading = true;
    this.service.printDocument(url).subscribe(result => {
      this.loading = false;
      window.open(
        url,
        '_blank'
      );
    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });
  }

  abreAtendimentoFichaDigital(id: Number) {
    this.errors = [];
    let url = 
      JSON.parse(localStorage.getItem("parametro_seguranca")).filter((url) => url.nome == "URL_FICHA_MEDICA_VISUALIZACAO")
      ?
      JSON.parse(localStorage.getItem("parametro_seguranca")).filter((url) => url.nome == "URL_FICHA_MEDICA_VISUALIZACAO")[0].valor.replace('{id}', id)
      :"";
    this.loading = true;
    this.service.openDocument(url).subscribe(result => {
      this.loading = false;
      window.open(
        url,
        '_blank'
      );
    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });
  }

  loadQuantityPerPagePagination(event) {
    let id = parseInt(event.target.value);
    this.paging.limit = id;

    this.setPagePagined(this.pager.offset, this.paging.limit);
  }

  setPagePagined(offset: number, limit: Number) {
    this.paging.offset = offset !== undefined ? offset : 0;
    this.paging.limit = limit ? limit : this.paging.limit;    
    this.buscaPaciente(this.paging.offset, this.paging.limit);
  }

  carregaEntidadeCampoPorEspecialidade() {    
    this.loading = true;
    this.allItemsEntidadeCampo = [];
    this.service.carregaEntidadeCampoPorEspecialidade().subscribe(result => {
      this.mostraFormulario = true;
      this.allItemsEntidadeCampo = result;         
      this.createGroup();
      this.loadDomains();
      this.loading = false;
    }, error => {
      this.createGroup();
      this.loadDomains();
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });
  }
}