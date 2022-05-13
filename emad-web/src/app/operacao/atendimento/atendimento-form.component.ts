import { Component, OnInit, ViewChild } from '@angular/core';
import { AtendimentoService } from './atendimento.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { PagerService } from '../../_core/_services';
import { Router, ActivatedRoute } from '@angular/router';
import { Atendimento, AtendimentoHistorico } from '../../_core/_models/Atendimento';
import { Paciente } from '../../_core/_models/Paciente';
import { Util } from '../../_core/_util/Util';
import { PlanoTerapeuticoService } from '../plano-terapeutico/plano-terapeutico.service';
import { PacienteHipotese } from '../../_core/_models/PacienteHipotese';
import { Encaminhamento } from '../../_core/_models/Encaminhamento';
import { AtendimentoMedicamento } from '../../_core/_models/AtendimentoMedicamento';
import { Material } from '../../_core/_models/Material';
import { ReciboReceitaImpressaoService } from '../../shared/services/recibo-receita-impressao.service';
import { environment } from '../../../environments/environment';
import { HipoteseDiagnostica } from '../../_core/_models/HipoteseDiagnostica';
import { PacienteProcedimento } from '../../_core/_models/PacienteProcedimento';
import { Procedimento } from '../../_core/_models/Procedimento';
import { ExameService } from '../../shared/services/exame.service';
import { Translation } from '../../_core/_locale/Translation';
import { Exame } from '../../_core/_models/Exame';
import { PacienteVacina } from '../../_core/_models/PacienteVacina';
import * as moment from 'moment';
import { ParticipanteAtividadeColetiva } from '../../_core/_models/ParticipanteAtividadeColetiva';
import { ProfissionalAtividadeColetiva } from '../../_core/_models/ProfissionalAtividadeColetiva';
import { tiposFornecimOdonto } from '../../_core/_models/tiposFornecimOdonto';
import { VigilanciaSaudeBucal } from '../../_core/_models/VigilanciaSaudeBucal';

@Component({
  selector: 'app-atendimento-form',
  templateUrl: './atendimento-form.component.html',
  styleUrls: ['./atendimento-form.component.css'],
  providers: [AtendimentoService, PlanoTerapeuticoService]
})
export class AtendimentoFormComponent implements OnInit {

  @ViewChild('contentConfirmacao') contentConfirmacao: any;

  loading: Boolean = false;
  message: string = "";
  errors: any[] = [];
  modalRef: NgbModalRef = null;
  modalLocalizacaoPacienteRef: NgbModalRef = null;
  modalFormularioRef: NgbModalRef = null;

  //FORMS
  form: FormGroup;
  formHistorico: FormGroup;
  formHipotese: FormGroup;
  formMedicamento: FormGroup;

  method: string = "atendimento";
  url: string = "atendimentos";
  object: Atendimento = new Atendimento();
  objectHistorico: AtendimentoHistorico = new AtendimentoHistorico();
  pacienteVacina: PacienteVacina = new PacienteVacina()
  editParticipanteAtividadeColetiva: ParticipanteAtividadeColetiva = new ParticipanteAtividadeColetiva()
  participanteAtividadeColetiva: ParticipanteAtividadeColetiva = new ParticipanteAtividadeColetiva()
  profissionalAtividadeColetiva: ProfissionalAtividadeColetiva = new ProfissionalAtividadeColetiva()
  paciente: Paciente = new Paciente();
  pacienteHipotese: PacienteHipotese = new PacienteHipotese();
  hipoteseDiagnostica: HipoteseDiagnostica = new HipoteseDiagnostica();
  encaminhamento: Encaminhamento = new Encaminhamento();
  atendimentoMedicamento: AtendimentoMedicamento = new AtendimentoMedicamento();
  medicamento: Material = new Material();
  virtualDirectory: string = environment.virtualDirectory != "" ? environment.virtualDirectory + "/" : "";
  atendimentoHistorico: AtendimentoHistorico = new AtendimentoHistorico();
  mostraFormulario: boolean = false;
  pacienteSelecionado: any = null;
  participanteSelecionadoAtividadeColetiva: any = null;
  participanteEditSelecionadoAtividadeColetiva: any = null;
  profissionalSelecionadoAtividadeColetiva: any = null;

  FornecimOdontoSelecionado: tiposFornecimOdonto = new tiposFornecimOdonto()
  VigilanciaSaudeBucalSelecionado: VigilanciaSaudeBucal = new VigilanciaSaudeBucal()

  qtdProcedimento: number;

  ListcondutaEncaminhamento: any[];

  medicamentoSelecionado: any = null;
  hipoteseDiagnosticaSelecionada: any = null;
  domains: any[] = [];
  allItemsEntidadeCampo: any[] = null;
  allItemsPesquisaHipoteseDiagnostica: any[] = null;
  pacienteProcedimento: PacienteProcedimento = new PacienteProcedimento();
  procedimento: Procedimento = new Procedimento();
  allItemsPesquisaProcedimento: any[] = null;
  allItemsProcedimento: any[] = [];

  profissionaisLista: any[];

  //PAGINATION
  allItems: any[] = [];
  pager: any = {};
  pagedItems: any[];
  pageLimit: number = 10;
  fieldsPacientes: any[] = [];
  fieldsExames: any[] = [];

  allItemsHipotese: any[] = [];
  allItemsEncaminhamento: any[] = [];
  allItemsMedicamento: any[] = [];
  allMedicamentos: any[] = [];
  allItemsExame: any[] = [];
  allItemsVacina: any[] = [];
  removeId: number;

  //ATIVIDADE COLETIVA
  allParticipantesAtividadeColetiva: any[];
  allProfissionaisAtividadeColetiva: any[];

  //FICHA ODONTO
  allTiposFornecimento: any[];
  allTiposVigilanciaBucal: any[];

  parouFumarAtividadeColetiva: boolean = null;
  abandonouGrupoAtividadeColetiva: boolean = null;

  atividadeTipo: number;
  validatorPublicoAlvo: boolean;
  pseEducacao: boolean;
  pseSaude: boolean;
  tipoFicha: number;
  tipoFichaSelecionada: string;
  isVisible: boolean;
  isVisibleParticipante: boolean;
  isRequired: boolean;
  sexoPaciente: string;
  totalParticipantes: number;

  localAtendimento: number;

  pathFiles = `${environment.apiUrl}/fotos/`;

  paging: any = {
    offset: 0,
    limit: 10,
    total: 0,
    sortColumn: '',
    sortOrder: ''
  };
  warning: string = "";
  totalPages: number;

  id: number;
  idHistorico: number;
  dataHistorico: string;
  nomeProfissional: string;
  nomeTipoHistorico: string;
  urlForm: string;
  exameId: number = 0;

  nomeVacina: string;
  validadeVacina: string;
  loteVacina: string;

  constructor(
    private service: AtendimentoService,
    private pagerService: PagerService,
    private pacienteService: PlanoTerapeuticoService,
    private reciboReceitaService: ReciboReceitaImpressaoService,
    private exameService: ExameService,
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

    for (let field of this.exameService.fields) {
      if (field.grid) {
        this.fieldsExames.push(field);
      }
    }
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.idHistorico = params['idHistorico'];
      this.carregaEntidadeCampoPorEspecialidade();
    });
    this.loading = true;
    this.buscaProfissionais();
  }

  createGroup() {
    this.form = this.fb.group({
      id: [''],
      idPaciente: [Validators.required],
      pacienteNome: [''],
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
      situacao: [Validators.required],
      motivoCancelamento: ['', ''],
      idEstabelecimento: [Validators.required],
      tipoFicha: ['', Validators.required],
      idClassificacaoRisco: ['', Validators.required],
      motivoQueixa: ['', ''],
      tipoHistoriaClinica: ['', ''],
      glicemia: ['', ''],
      ficouEmObservacao: ['', ''],
      inep: ['', ''],
      numParticipantes: ['', ''],
      profissionais: ['', ''],
      atividadeTipo: ['', ''],
      temasParaReuniao: ['', ''],
      temasParaSaude: ['', ''],
      publicoAlvo: ['', ''],
      procedimento: ['', ''],
      praticasEmSaude: ['', ''],
      pseEducacao: ['', ''],
      pseSaude: ['', ''],
      parouFumar: ['', ''],
      abandonouGrupo: ['', ''],
      avaliacaoAlterada: ['', ''],
      gestante: ['', ''],
      possuiNecessidadesEspeciais: ['', ''],
      tipoConsultaOdonto: ['', ''],
      condutaEncaminhamento: ['', ''],
      localDeAtendimento: new FormControl({ value: '1', disabled: false }),
      modalidade: ['', ''],
      tipoAtendimento: ['', ''],
      vacinasEmDia: ['', '']
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
      pacienteHistoriaProgressa: new FormControl({ value: '', disabled: true }),
      pressaoArterial: new FormControl({ value: '', disabled: true }),
      pulso: new FormControl({ value: '', disabled: true }),
      saturacao: new FormControl({ value: '', disabled: true }),
      temperatura: new FormControl({ value: '', disabled: true }),
      altura: new FormControl({ value: '', disabled: true }),
      peso: new FormControl({ value: '', disabled: true }),
      historicoClinico: new FormControl({ value: '', disabled: true }),
      exameFisico: new FormControl({ value: '', disabled: true }),
      observacoesGerais: new FormControl({ value: '', disabled: true }),
      situacao: new FormControl({ value: '', disabled: true }),
      motivoCancelamento: new FormControl({ value: '', disabled: true }),
      tipoFicha: new FormControl({ value: '', disabled: true }),
      idClassificacaoRisco: new FormControl({ value: '', disabled: true }),
      motivoQueixa: new FormControl({ value: '', disabled: true }),
      tipoHistoriaClinica: new FormControl({ value: '', disabled: true }),
      glicemia: new FormControl({ value: '', disabled: true }),
      ficouEmObservacao: new FormControl({ value: '', disabled: true }),
      inep: new FormControl({ value: '', disabled: true }),
      numParticipantes: new FormControl({ value: '', disabled: true }),
      profissionais: new FormControl({ value: '', disabled: true }),
      atividadeTipo: new FormControl({ value: '', disabled: true }),
      temasParaReuniao: new FormControl({ value: '', disabled: true }),
      publicoAlvo: new FormControl({ value: '', disabled: true }),
      procedimento: new FormControl({ value: '', disabled: true }),
      temasParaSaude: new FormControl({ value: '', disabled: true }),
      praticasEmSaude: new FormControl({ value: '', disabled: true }),
      pseEducacao: new FormControl({ value: '', disabled: true }),
      pseSaude: new FormControl({ value: '', disabled: true }),
      parouFumar: new FormControl({ value: '', disabled: true }),
      abandonouGrupo: new FormControl({ value: '', disabled: true }),
      avaliacaoAlterada: new FormControl({ value: '', disabled: true }),
      gestante: new FormControl({ value: '', disabled: true }),
      possuiNecessidadesEspeciais: new FormControl({ value: '', disabled: true }),
      tipoConsultaOdonto: new FormControl({ value: '', disabled: true }),
      condutaEncaminhamento: new FormControl({ value: '', disabled: true }),
      localDeAtendimento: new FormControl({ value: '', disabled: true }),
      modalidade: new FormControl({ value: '', disabled: true }),
      tipoAtendimento: new FormControl({ value: '', disabled: true }),
      vacinasEmDia: new FormControl({ value: '', disabled: true }),
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

  buscaHipoteseDiagnostica(offset: Number = null, limit: Number = null) {
    this.loading = true;

    this.paging.offset = offset ? offset : 0;
    this.paging.limit = limit ? limit : 10;

    var params = "?nome=" + this.hipoteseDiagnostica.nome + "&cid=" + this.hipoteseDiagnostica.cid_10;

    if (this.paging.offset != null && this.paging.limit != null) {
      params += (params == "" ? "?" : "&") + "offset=" + this.paging.offset + "&limit=" + this.paging.limit;
    }

    this.service.list('hipotese-diagnostica' + params).subscribe(result => {
      this.warning = "";
      this.paging.total = result.total;
      this.totalPages = Math.ceil((this.paging.total / this.paging.limit));
      this.allItemsPesquisaHipoteseDiagnostica = result.items;
      setTimeout(() => {
        this.loading = false;
      }, 300);
    }, erro => {
      setTimeout(() => this.loading = false, 300);
      this.errors = Util.customHTTPResponse(erro);
    });
  }

  buscaMedicamento() {
    this.loading = true;
    let params = "";
    this.allMedicamentos = [];

    if (Util.isEmpty(this.medicamento.descricao) || this.medicamento.descricao.length < 3) {
      this.errors = [{ message: "Informe a descrição do medicamento, ao menos 3 caracteres" }];
      this.loading = false;
      return;
    }

    params = "?descricao=" + this.medicamento.descricao + "&idGrupoMaterial=" + this.medicamento.idGrupoMaterial;

    this.service.list('material/especialidade-usuario' + params).subscribe(result => {
      this.allMedicamentos = result;
      this.setPage(1);
      this.loading = false;
      this.errors = [];
    }, erro => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(erro);
    });

  }

  buscaExames(offset: Number = null, limit: Number = null) {
    this.loading = true;
    let params = "pesquisa=1&";

    this.paging.offset = offset ? offset : 0;
    this.paging.limit = limit ? limit : 10;
    this.paging.sortColumn = 'dataCriacao';
    this.paging.sortOrder = 'desc';

    let exame = new Exame();

    exame.nomePaciente = this.object.pacienteNome;
    exame.idPaciente = this.object.idPaciente;
    exame.idEstabelecimento = this.paciente.idEstabelecimento;

    if (!Util.isEmpty(exame)) {
      if (Object.keys(exame).length) {
        for (let key of Object.keys(exame)) {
          if (!Util.isEmpty(exame[key])) {
            params += key + "=" + exame[key] + "&";
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

    if (this.paging.sortColumn) {
      params += (params == "" ? "?" : "&") + `sortColumn=${this.paging.sortColumn}&sortOrder=${this.paging.sortOrder}`;
    }

    this.service.list('exame' + params).subscribe(result => {
      this.paging.total = result.total;
      this.totalPages = Math.ceil((this.paging.total / this.paging.limit));
      this.allItemsExame = result.items;
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

    this.modalLocalizacaoPacienteRef = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      windowClass: 'modal-gg'
    });
  }

  openHipotese(content: any) {
    this.errors = [];
    this.message = "";
    this.allItemsPesquisaHipoteseDiagnostica = [];
    this.pacienteHipotese = new PacienteHipotese();
    this.hipoteseDiagnostica = new HipoteseDiagnostica();

    this.modalRef = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: "lg"
    });
  }

  openEncaminhamento(content: any) {
    this.errors = [];
    this.message = "";
    this.encaminhamento = new Encaminhamento();
    this.encaminhamento.idPaciente = this.object.idPaciente;
    this.encaminhamento.idAtendimento = this.object.id;

    this.modalRef = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: "lg"
    });
  }

  openMedicamento(content: any) {
    this.errors = [];
    this.message = "";
    this.atendimentoMedicamento = new AtendimentoMedicamento();
    this.atendimentoMedicamento.idPaciente = this.object.idPaciente;
    this.atendimentoMedicamento.idAtendimento = this.object.id;
    this.medicamento.descricao = "";
    this.medicamentoSelecionado = null;
    this.allMedicamentos = [];

    this.modalRef = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      windowClass: 'modal-gg'
    });
  }

  openVacinas(content: any) {
    this.errors = [];
    this.message = "";
    this.atendimentoMedicamento.idPaciente = this.object.idPaciente;
    this.atendimentoMedicamento.idAtendimento = this.object.id;

    this.modalRef = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      windowClass: 'modal-gg'
    });
  }

  openTipoVigilanciaOdonto(content: any) {
    this.modalRef = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      windowClass: 'modal-gg'
    });
  }

  openTipoFornecimentoOdonto(content: any) {
    this.modalRef = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      windowClass: 'modal-gg'
    });
  }

  openConfirmacao(content: any) {
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

  openProcedimento(content: any) {
    this.errors = [];
    this.message = "";
    this.allItemsPesquisaProcedimento = [];
    this.pacienteProcedimento = new PacienteProcedimento();
    this.procedimento = new Procedimento();

    this.modalRef = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: "lg"
    });
  }

  openExame(content: any) {
    this.clear();
    this.allItemsExame = [];
    this.buscaExames();

    this.modalRef = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      windowClass: 'modal-gg'
    });
  }

  openFormularioExame(content: any) {
    this.exameId = 0;
    this.modalFormularioRef = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      windowClass: 'modal-gg'
    });
  }

  formularioSalvoChange(event) {
    this.modalFormularioRef.close();
    this.buscaExames();
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
    if (this.tipoFichaSelecionada === "7" || this.tipoFicha === 7) {
      this.participanteSelecionadoAtividadeColetiva = item;
    } else {
      this.pacienteSelecionado = item;
    }

  }
  selecionaProfissional(item) {
    this.profissionalSelecionadoAtividadeColetiva = item;
    this.profissionalAtividadeColetiva.idProfissional = item.id;
    this.profissionalAtividadeColetiva.idAtendimento = this.object.id;
  }

  selecionaMedicamento(item) {
    this.medicamentoSelecionado = item;
  }

  confirmaPaciente() {

    if (this.tipoFichaSelecionada === "7" || this.tipoFicha === 7) {

      this.participanteAtividadeColetiva.idAtendimento = this.object.id;
      this.participanteAtividadeColetiva.idPaciente = this.participanteSelecionadoAtividadeColetiva.id;
      this.participanteAtividadeColetiva.nomePaciente = this.participanteSelecionadoAtividadeColetiva.nome;
      this.participanteAtividadeColetiva.sexo = this.participanteSelecionadoAtividadeColetiva.sexo;
      this.participanteAtividadeColetiva.cartaoSus = this.participanteSelecionadoAtividadeColetiva.cartaoSus;
      this.participanteAtividadeColetiva.dataNascimento = this.participanteSelecionadoAtividadeColetiva.dataNascimento;
      this.participanteAtividadeColetiva.sexo == 1 ? this.sexoPaciente = 'Masculino' : this.sexoPaciente = 'Feminino'

    } else {

      this.object.idPaciente = this.pacienteSelecionado.id;
      this.object.pacienteNome = this.pacienteSelecionado.nome;
      this.object.pacienteHistoriaProgressa = this.pacienteSelecionado.historiaProgressaFamiliar;

      this.findPacienteData(this.object.idPaciente);

    }

    this.closeLocalizacaoPaciente();

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
      this.localAtendimento = result.localDeAtendimento;
      this.loading = false;

      this.tipoFicha = result.tipoFicha;

      if (result.atividadeTipo === 1 || result.atividadeTipo === 2 || result.atividadeTipo === 3) {
        this.isVisible = false
      } else {
        this.isVisible = true
      }

      this.findHipotesePorAtendimento();
      this.findEncaminhamentoPorAtendimento();
      this.findMedicamentoPorAtendimento();
      this.findHistoricoPorAtendimento();
      this.findProcedimentoPorAtendimento();
      this.findVacinaPorAtendimento();
      this.findParticipanteAtividadeColetivaPorAtendimento();
      this.findProfissionaisAtividadeColetivaPorAtendimento();
      this.findtiposFornecimentoOdontoPorAtendimento();
      this.findtiposVigilanciaOdontoPorAtendimento();
      this.buscaProfissionais();
      this.carregarCondutaEncaminhamento(this.tipoFicha)

    }, error => {
      this.object = new Atendimento();
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

  encontraAtendimentoHistorico(idHistorico: number) {
    this.object.id = this.id;
    this.errors = [];
    this.message = "";

    if (idHistorico) {
      this.loading = true;
      this.service.findByHistoricoId(idHistorico).subscribe(result => {
        this.objectHistorico = result;
        this.dataHistorico = result.dataHistorico;
        this.nomeProfissional = result.nomeProfissional;
        this.nomeTipoHistorico = result.nomeTipoHistorico;
        this.objectHistorico.pacienteHistoriaProgressa = result.pacienteHistoriaProgressa;
        this.loading = false;

        this.findHipotesePorAtendimento();
        this.findEncaminhamentoPorAtendimento();
        this.findMedicamentoPorAtendimento();
        this.findHistoricoPorAtendimento();
        this.findProcedimentoPorAtendimento();
        this.findVacinaPorAtendimento();
        this.findParticipanteAtividadeColetivaPorAtendimento();
        this.findProfissionaisAtividadeColetivaPorAtendimento();
        this.findtiposFornecimentoOdontoPorAtendimento();
        this.findtiposVigilanciaOdontoPorAtendimento();
        this.carregarCondutaEncaminhamento(this.tipoFicha);

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
        this.findHistoricoPorAtendimento();
        if (res.ano_receita)
          this.object.ano_receita = res.ano_receita;

        if (res.numeroReceita)
          this.object.numero_receita = res.numeroReceita;

        if (res.idEstabelecimento)
          this.object.unidade_receita = res.idEstabelecimento;

        if (res.dadosFicha)
          this.object.dadosFicha = res.dadosFicha;

        if (this.form.value.id) {
          this.message = "Atendimento alterado com sucesso";

          if (!Util.isEmpty(this.object.ano_receita) && !Util.isEmpty(this.object.numero_receita) && !Util.isEmpty(this.object.unidade_receita))
            this.abreReceitaMedica(this.object.ano_receita, this.object.numero_receita, this.object.unidade_receita);
        } else {
          this.abreFichaDigital(this.object.id, false);
        }

        if (!this.message) {
          this.message = "Cadastro efetuado com sucesso!";
          this.openConfirmacao(this.contentConfirmacao);
        }

        if (this.tipoFicha == 7 || this.tipoFichaSelecionada === "7" || this.isVisible === true) {
          this.findParticipanteAtividadeColetivaPorAtendimento();
          this.findProfissionaisAtividadeColetivaPorAtendimento();
        }

        if (this.tipoFicha == 8) {
          this.findtiposFornecimentoOdontoPorAtendimento();
          this.findtiposVigilanciaOdontoPorAtendimento();
        }

        if (this.object.situacao) {
          if (this.object.situacao == 'X') {
            this.message = "Atendimento cancelado com sucesso";
            this.object = new Atendimento();
          }
          else if (this.object.situacao == 'C' || this.object.situacao == '0')
            this.message = "Atendimento alterado com sucesso"
          else {
            this.message = "Atendimento finalizado com sucesso"
            this.object = new Atendimento();
          }
        }
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

      if (result) {

        console.log(result)

        if (this.tipoFicha == 7 || this.tipoFichaSelecionada === "7") {
          this.object = result;
          this.object.pacienteNome = this.pacienteSelecionado.nome;
          this.object.pacienteHistoriaProgressa = this.pacienteSelecionado.historiaProgressaFamiliar;
          this.loading = false;

        } else {
          this.object = result;
          this.object.pacienteNome = this.pacienteSelecionado.nome;
          this.object.pacienteHistoriaProgressa = this.pacienteSelecionado.historiaProgressaFamiliar;
          this.loading = false;

          this.findHipotesePorAtendimento();
          this.findEncaminhamentoPorAtendimento();
          this.findMedicamentoPorAtendimento();
          this.findHistoricoPorAtendimento();
          this.findProcedimentoPorAtendimento();
          this.findVacinaPorAtendimento();
          this.findtiposFornecimentoOdontoPorAtendimento();
          this.findtiposVigilanciaOdontoPorAtendimento();

        }

      }
      else
        this.limpaAtendimento();
    }, error => {
      this.limpaAtendimento();
    });
  }

  limpaAtendimento() {
    this.object = new Atendimento();
    this.object.idPaciente = this.pacienteSelecionado.id;
    this.object.pacienteNome = this.pacienteSelecionado.nome;
    this.object.pacienteHistoriaProgressa = this.pacienteSelecionado.historiaProgressaFamiliar;
    this.loading = false;

    this.allItemsEncaminhamento = [];
    this.allItemsHipotese = [];
    this.allItemsMedicamento = [];
    this.allParticipantesAtividadeColetiva = [];
    this.allProfissionaisAtividadeColetiva = [];
    this.allTiposFornecimento = [];
    this.allTiposVigilanciaBucal = [];   
    this.allItemsProcedimento = [];   
      
    if(!this.object.id){
      this.object.localDeAtendimento = 1;
      this.object.tipoAtendimento = 5;
    }

    this.errors.push({
      message: "Atendimento não encontrado"
    });
  }

  findHipotesePorAtendimento() {
    this.message = "";
    this.errors = [];
    this.loading = true;
    this.service.findHipoteseByAtendimento(this.object.id).subscribe(result => {
      this.allItemsHipotese = result;
      this.loading = false;
    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });
  }

  findVacinaPorAtendimento() {
    this.message = "";
    this.errors = [];
    this.loading = true;
    this.service.findVacinaByAtendimento(this.object.id).subscribe(result => {
      this.allItemsVacina = result;
      this.loading = false;
    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });
  }

  findEncaminhamentoPorAtendimento() {
    this.message = "";
    this.errors = [];
    this.loading = true;
    this.service.findEncaminhamentoByAtendimento(this.object.id).subscribe(result => {
      this.allItemsEncaminhamento = result;
      this.loading = false;
    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });
  }

  findMedicamentoPorAtendimento() {
    this.message = "";
    this.errors = [];
    this.loading = true;
    this.service.findMedicamentoByAtendimento(this.object.id).subscribe(result => {
      this.allItemsMedicamento = result;
      this.loading = false;
    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
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

  findProcedimentoPorAtendimento() {
    this.message = "";
    this.errors = [];
    this.loading = true;
    this.service.findProcedimentoByAtendimento(this.object.id).subscribe(result => {
      this.allItemsProcedimento = result;
      this.loading = false;
    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });
  }

  close() {
    if (this.modalRef)
      this.modalRef.close();
  }

  closeLocalizacaoPaciente() {
    if (this.modalLocalizacaoPacienteRef)
      this.modalLocalizacaoPacienteRef.close();
  }

  closeExameFormulario() {
    if (this.modalFormularioRef)
      this.modalFormularioRef.close();
  }

  loadDomains() {



    this.loading = true;
    this.service.listDomains('especialidade').subscribe(especialidades => {
      this.service.findTipoFichaEstabelecimento(this.paciente.idEstabelecimento).subscribe(tipoFichas => {
        this.service.listDomains('grupo-material').subscribe(gruposMateriais => {
          this.service.listDomains('classificacao-risco').subscribe(classificacaoRiscos => {
            this.service.listDomains('atividade-procedimento').subscribe(atividadeProcedimento => {
              this.service.listDomains('atividade-tipo').subscribe(atividadeTipo => {
                this.service.listDomains('atividade-temas').subscribe(atividadeTemas => {
                  this.service.listDomains('atividade-publico').subscribe(atividadePublico => {
                    this.service.listDomains('atividade-praticas-saude').subscribe(atividadePraticasSaude => {
                      this.service.listDomains('atividade-temas-saude').subscribe(atividadeTemasSaude => {
                        this.service.listDomains('odonto-fornecimento').subscribe(tiposFornecimOdonto => {
                          this.service.listDomains('odonto-vigilancia').subscribe(tiposVigilanciaSaudeBucal => {
                            this.service.listDomains('local-atendimento').subscribe(localDeAtendimento => {
                              this.service.listDomains('modalidade').subscribe(modalidade => {
                                this.service.listDomains('tipo-atendimento').subscribe(tipoAtendimento => {
                                  this.domains.push({
                                    especialidades: especialidades,
                                    tipoFichas: tipoFichas,
                                    classificacaoRiscos: classificacaoRiscos,
                                    idGrupoMaterial: gruposMateriais,
                                    atividadeProcedimento: atividadeProcedimento,
                                    atividadeTipo: atividadeTipo,
                                    atividadeTemas: atividadeTemas,
                                    atividadePublico: atividadePublico,
                                    atividadePraticasSaude: atividadePraticasSaude,
                                    atividadeTemasSaude: atividadeTemasSaude,
                                    tiposFornecimOdonto: tiposFornecimOdonto,
                                    tiposVigilanciaSaudeBucal: tiposVigilanciaSaudeBucal,
                                    localDeAtendimento: localDeAtendimento,
                                    modalidade: modalidade,
                                    tipoAtendimento: tipoAtendimento,
                                    tipoHistoriaClinica: [
                                      { id: 1, nome: "Anamnese" },
                                      { id: 2, nome: "Evolução" },
                                    ],
                                    tiposConsultaOdonto: [
                                      { id: 1, nome: "Primeira consulta odontológica programática" },
                                      { id: 2, nome: "Consulta de retorno em odontologia" },
                                      { id: 4, nome: "Consulta de manutenção em odontologia" },
                                    ]
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
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });

  }

  selecionaHipoteseDiagnostica(item) {
    this.hipoteseDiagnostica = item;
  }

  pesquisaHipoteseDiagnostica() {
    this.loading = true;
    let params = "";
    this.allItemsPesquisaHipoteseDiagnostica = [];
    this.errors = [];

    if (Util.isEmpty(this.hipoteseDiagnostica.nome) && Util.isEmpty(this.hipoteseDiagnostica.cid_10)) {
      this.errors = [{ message: "Informe o nome ou código CID 10" }];
      this.loading = false;
      return;
    }

    if (!Util.isEmpty(this.hipoteseDiagnostica.nome)) {
      if (this.hipoteseDiagnostica.nome.length < 3) {
        this.errors = [{ message: "Informe o nome, ao menos 3 caracteres" }];
        this.loading = false;
        return;
      }
    }

    if (!Util.isEmpty(this.hipoteseDiagnostica.cid_10)) {
      if (this.hipoteseDiagnostica.cid_10.length < 2) {
        this.errors = [{ message: "Informe o código CID 10, ao menos 2 caracteres" }];
        this.loading = false;
        return;
      }
    }

    this.buscaHipoteseDiagnostica();
  }

  disableHipoteseButton() {
    return Util.isEmpty(this.hipoteseDiagnostica.id);
  }

  disableVacinaButton() {
    return Util.isEmpty(this.pacienteVacina.validade) || Util.isEmpty(this.pacienteVacina.nome) || Util.isEmpty(this.pacienteVacina.lote);
  }

  disableEncaminhamentoButton() {
    return Util.isEmpty(this.encaminhamento.idPaciente) || Util.isEmpty(this.encaminhamento.idEspecialidade) || Util.isEmpty(this.encaminhamento.motivo);
  }

  disableMedicamentoButton() {
    return Util.isEmpty(this.atendimentoMedicamento.idPaciente) ||
      Util.isEmpty(this.medicamentoSelecionado) ||
      Util.isEmpty(this.atendimentoMedicamento.uso) ||
      Util.isEmpty(this.atendimentoMedicamento.tipoVia) ||
      Util.isEmpty(this.atendimentoMedicamento.quantidade) ||
      Util.isEmpty(this.atendimentoMedicamento.apresentacao) ||
      Util.isEmpty(this.atendimentoMedicamento.posologia) ||
      Util.isEmpty(this.atendimentoMedicamento.idAtendimento);
  }

  saveHipotese() {
    this.message = "";
    this.errors = [];
    this.loading = true;

    this.pacienteHipotese.idHipoteseDiagnostica = this.hipoteseDiagnostica.id;
    this.pacienteHipotese.idPaciente = this.object.idPaciente;
    this.pacienteHipotese.idAtendimento = this.object.id;
    this.paciente.idEstabelecimento = this.object.idEstabelecimento;

    this.service.saveHipotese(this.pacienteHipotese).subscribe(result => {
      this.message = "Hipótese diagnóstica inserida com sucesso!"
      this.modalRef.close();
      this.loading = false;
      this.findHipotesePorAtendimento();
    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });
  }

  saveVacina() {
    this.message = "";
    this.errors = [];
    this.loading = true;

    this.pacienteVacina.idPaciente = this.object.idPaciente;
    this.pacienteVacina.idAtendimento = this.object.id;
    this.pacienteVacina.validade = moment(this.pacienteVacina.validade).format('YYYY/MM/DD hh:mm:ss');

    this.service.saveVacina(this.pacienteVacina).subscribe(result => {
      this.message = "Vacina inserida com sucesso!"
      this.modalRef.close();
      this.loading = false;
      this.findVacinaPorAtendimento();
    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });
  }

  saveEncaminhamento() {
    this.message = "";
    this.errors = [];
    this.loading = true;

    this.service.saveEncaminhamento(this.encaminhamento).subscribe(result => {
      this.message = "Encaminhamento inserido com sucesso!"
      this.modalRef.close();
      this.loading = false;
      this.findEncaminhamentoPorAtendimento();
    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });
  }

  saveMedicamento() {
    this.message = "";
    this.errors = [];
    this.loading = true;

    this.atendimentoMedicamento.idMaterial = this.medicamentoSelecionado.id;

    this.service.saveMedicamento(this.atendimentoMedicamento).subscribe(result => {
      this.message = "Medicamento inserido com sucesso!"
      this.modalRef.close();
      this.loading = false;
      this.findMedicamentoPorAtendimento();
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
      this.findHipotesePorAtendimento();
    });
  }

  removeVacina(item) {
    this.service.removeVacina(item.id).subscribe(result => {
      this.message = "Vacina removida com sucesso!"
      this.close();
      this.loading = false;
      this.findVacinaPorAtendimento();
    });
  }

  removeEncaminhamento(item) {
    this.service.removeEncaminhamento(item.id).subscribe(result => {
      this.message = "Encaminhamento removido com sucesso!"
      this.close();
      this.loading = false;
      this.findEncaminhamentoPorAtendimento();
    });
  }

  removeMedicamento(item) {
    this.service.removeMedicamento(item.id).subscribe(result => {
      this.message = "Medicamento removido com sucesso!"
      this.close();
      this.loading = false;
      this.findMedicamentoPorAtendimento();
    });
  }

  removeProcedimento(item) {
    this.service.removeProcedimento(item.id).subscribe(result => {
      this.message = "Hipótese diagnóstica removida com sucesso!"
      this.close();
      this.loading = false;
      this.findProcedimentoPorAtendimento();
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

  abreHistorico(id: Number) {
    if (!id)
      return;

    let url = this.router.url.replace('atendimentos/cadastro/' + this.id, '') + this.virtualDirectory + "#/atendimentos/historico/" + id;

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
    if ((!this.object.dadosFicha || this.object.dadosFicha.length == 0) && !grid)
      return;

    this.errors = [];
    let url =
      JSON.parse(localStorage.getItem("parametro_seguranca")).filter((url) => url.nome == "URL_FICHA_MEDICA_IMPRESSAO")
        ?
        JSON.parse(localStorage.getItem("parametro_seguranca")).filter((url) => url.nome == "URL_FICHA_MEDICA_IMPRESSAO")[0].valor.replace('{id}', id)
        : "";
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

  abreReceitaMedica(ano_receita: number, numero_receita: number, unidade_receita: number) {
    this.reciboReceitaService.imprimir(ano_receita, unidade_receita, numero_receita, false);
  }

  abreAtendimentoFichaDigital(id: Number) {
    this.errors = [];
    let url =
      JSON.parse(localStorage.getItem("parametro_seguranca")).filter((url) => url.nome == "URL_FICHA_MEDICA_VISUALIZACAO")
        ?
        JSON.parse(localStorage.getItem("parametro_seguranca")).filter((url) => url.nome == "URL_FICHA_MEDICA_VISUALIZACAO")[0].valor.replace('{id}', id)
        : "";
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

  loadQuantityPerPagePaginationHipotese(event) {
    let id = parseInt(event.target.value);
    this.paging.limit = id;

    this.setPagePaginedHipotese(this.pager.offset, this.paging.limit);
  }

  setPagePagined(offset: number, limit: Number) {
    this.paging.offset = offset !== undefined ? offset : 0;
    this.paging.limit = limit ? limit : this.paging.limit;

    this.buscaPaciente(this.paging.offset, this.paging.limit);
  }

  setPagePaginedHipotese(offset: number, limit: Number) {
    this.paging.offset = offset !== undefined ? offset : 0;
    this.paging.limit = limit ? limit : this.paging.limit;

    this.buscaHipoteseDiagnostica(this.paging.offset, this.paging.limit);
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

  visualizaProntuarioPaciente(idPaciente: any): void {
    let url = this.router.url.replace('atendimentos/cadastro/' + this.id, '') + this.virtualDirectory + "#/pacientes/prontuario/" + idPaciente + "?hideMenu=true";
    this.service.file('atendimento/consulta-por-paciente', url).subscribe(result => {
      this.loading = false;
      window.open(
        url,
        '_blank'
      );
    });
  }

  pesquisaProcedimento() {
    this.loading = true;
    let params = "";
    this.allItemsPesquisaProcedimento = [];
    this.errors = [];

    if (Util.isEmpty(this.procedimento.co_procedimento) && Util.isEmpty(this.procedimento.no_procedimento)) {
      this.errors = [{ message: "Informe o código ou nome do procedimento" }];
      this.loading = false;
      return;
    }

    if (!Util.isEmpty(this.procedimento.no_procedimento)) {
      if (this.procedimento.no_procedimento.length < 3) {
        this.errors = [{ message: "Informe o nome, ao menos 3 caracteres" }];
        this.loading = false;
        return;
      }
    }

    if (!Util.isEmpty(this.procedimento.co_procedimento)) {
      if (this.procedimento.co_procedimento.length < 2) {
        this.errors = [{ message: "Informe o código, ao menos 2 caracteres" }];
        this.loading = false;
        return;
      }
    }

    this.buscaProcedimento();
  }

  buscaProcedimento(offset: Number = null, limit: Number = null) {
    this.loading = true;

    this.paging.offset = offset ? offset : 0;
    this.paging.limit = limit ? limit : 10;

    var params = "?codigo=" + this.procedimento.co_procedimento + "&nome=" + this.procedimento.no_procedimento + "&tipoFicha=" + (this.tipoFichaSelecionada ? this.tipoFichaSelecionada : this.tipoFicha);

    if (this.paging.offset != null && this.paging.limit != null) {
      params += (params == "" ? "?" : "&") + "offset=" + this.paging.offset + "&limit=" + this.paging.limit;
    }

    this.service.list('procedimento' + params).subscribe(result => {
      this.warning = "";
      this.paging.total = result.total;
      this.totalPages = Math.ceil((this.paging.total / this.paging.limit));
      this.allItemsPesquisaProcedimento = result.items;
      setTimeout(() => {
        this.loading = false;
      }, 300);
    }, erro => {
      setTimeout(() => this.loading = false, 300);
      this.errors = Util.customHTTPResponse(erro);
    });
  }

  selecionaProcedimento(item) {
    this.procedimento = item;
  }

  saveProcedimento() {
    this.message = "";
    this.errors = [];
    this.pacienteProcedimento.idProcedimento = this.procedimento.id;
    this.pacienteProcedimento.idPaciente = this.object.idPaciente;
    this.pacienteProcedimento.idAtendimento = this.object.id;
    this.pacienteProcedimento.qtd = this.qtdProcedimento;

    this.service.saveProcedimento(this.pacienteProcedimento).subscribe(result => {
      this.message = "Procedimento inserido com sucesso!"
      this.modalRef.close();
      this.loading = false;
      this.findProcedimentoPorAtendimento();
    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });

    this.close();
  }

  loadQuantityPerPagePaginationProcedimento(event) {
    let id = parseInt(event.target.value);
    this.paging.limit = id;

    this.setPagePaginedProcedimento(this.pager.offset, this.paging.limit);
  }

  setPagePaginedProcedimento(offset: number, limit: Number) {
    this.paging.offset = offset !== undefined ? offset : 0;
    this.paging.limit = limit ? limit : this.paging.limit;

    this.buscaProcedimento(this.paging.offset, this.paging.limit);
  }

  disableProcedimentoButton() {
    return Util.isEmpty(this.procedimento.id);
  }

  translate(term, obj) {
    if (typeof (obj) == 'object') {
      return obj[term];
    }
    else {
      return Translation.t(term);
    }
  }

  viewer(id: number, content: any) {
    if (!id) return;

    this.exameId = id;

    this.modalFormularioRef = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      windowClass: 'modal-gg'
    });
  }

  //ATIVIDADE COLETIVA
  back() {
    const route = "atendimentos";
    this.router.navigate([route]);
  }
  changeFn(event) {
    let id = parseInt(event.target.value);

    if (id === 1 || id === 2 || id === 3) {
      this.isVisible = false
    } else {
      this.isVisible = true
    }
  }
  change(event) {
    this.tipoFichaSelecionada = event.target.value;
    this.carregarCondutaEncaminhamento(event.target.value)
  }
  openAtividadeColetivaParticipante(content: any) {

    this.clear();
    this.participanteSelecionadoAtividadeColetiva = null;
    this.participanteAtividadeColetiva.idPaciente = null;
    this.participanteAtividadeColetiva.nomePaciente = '';
    this.participanteAtividadeColetiva.cartaoSus = '';
    this.participanteAtividadeColetiva.dataNascimento = '';
    this.participanteAtividadeColetiva.sexo = 0;
    this.participanteAtividadeColetiva.parouFumar = false;
    this.participanteAtividadeColetiva.abandonouGrupo = false;
    this.participanteAtividadeColetiva.avaliacaoAlterada = false;
    this.participanteAtividadeColetiva.peso = '';
    this.participanteAtividadeColetiva.altura = '';

    this.modalRef = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: "lg"
    });
  }
  openAtividadeColetivaProfissional(content: any) {
    this.modalRef = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: "lg"
    });
  }
  saveParticipanteAtividadeColetiva() {
    this.message = "";
    this.errors = [];
    this.loading = true;

    this.service.saveParticipanteAtividadeColetiva(this.participanteAtividadeColetiva).subscribe(result => {
      this.message = "Profissional inserido com sucesso!"
      this.close();
      this.loading = false;
      this.findParticipanteAtividadeColetivaPorAtendimento();

    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });
  }
  saveEditParticipanteAtividadeColetiva() {
    this.message = "";
    this.errors = [];
    this.loading = true;

    this.service.saveParticipanteAtividadeColetiva(this.editParticipanteAtividadeColetiva).subscribe(result => {
      this.message = "Profissional atualizado com sucesso!"
      this.close();
      this.loading = false;
      this.findParticipanteAtividadeColetivaPorAtendimento();

    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });
  }
  findParticipanteAtividadeColetivaPorAtendimento() {
    this.message = "";
    this.errors = [];
    this.loading = true;
    this.service.findParticipanteAtividadeColetivaByAtendimento(this.object.id).subscribe(result => {
      this.allParticipantesAtividadeColetiva = result;
      this.loading = false;
      this.totalParticipantes = result.length;

      if (result.length < this.object.numParticipantes) {
        this.isVisibleParticipante = true
      } else {
        this.isVisibleParticipante = false
      }

    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });
  }
  removeParticipanteAtividadeColetivaPorAtendimento(item) {
    this.service.removeParticipante(item.id).subscribe(result => {
      this.message = "Participante removido com sucesso!"
      this.loading = false;
      this.findParticipanteAtividadeColetivaPorAtendimento();
    });
  }
  editParticipanteAtividadeColetivaPorAtendimento(item, content) {

    this.editParticipanteAtividadeColetiva.id = item.id;
    this.editParticipanteAtividadeColetiva.idAtendimento = item.idAtendimento;
    this.editParticipanteAtividadeColetiva.idPaciente = item.idPaciente;
    this.editParticipanteAtividadeColetiva.nomePaciente = item.nome;
    this.editParticipanteAtividadeColetiva.cartaoSus = item.cartaoSus;
    this.editParticipanteAtividadeColetiva.dataNascimento = item.dataNascimento;
    this.editParticipanteAtividadeColetiva.sexo = item.sexo;
    this.editParticipanteAtividadeColetiva.parouFumar = item.parouFumar;
    this.editParticipanteAtividadeColetiva.abandonouGrupo = item.abandonouGrupo;
    this.editParticipanteAtividadeColetiva.avaliacaoAlterada = item.avaliacaoAlterada;
    this.editParticipanteAtividadeColetiva.peso = item.peso;
    this.editParticipanteAtividadeColetiva.altura = item.altura;

    this.modalRef = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: "lg"
    });

  }
  findProfissionaisAtividadeColetivaPorAtendimento() {
    this.message = "";
    this.errors = [];
    this.loading = true;
    this.service.findProfissionalAtividadeColetivaByAtendimento(this.object.id).subscribe(result => {
      this.allProfissionaisAtividadeColetiva = result;
      this.loading = false;
    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });
  }
  saveProfissionalAtividadeColetiva() {
    this.message = "";
    this.errors = [];
    this.loading = true;

    this.service.saveProfissionalAtividadeColetiva(this.profissionalAtividadeColetiva).subscribe(result => {
      this.message = "Profissional inserido com sucesso!"
      this.close();
      this.loading = false;
      this.findProfissionaisAtividadeColetivaPorAtendimento();

    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });
  }
  removeProfissionalAtividadeColetivaPorAtendimento(item) {
    this.service.removeProfissional(item.id).subscribe(result => {
      this.message = "Profissional removido com sucesso!"
      this.loading = false;
      this.findProfissionaisAtividadeColetivaPorAtendimento();
    });
  }
  buscaProfissionais() {
    this.loading = true;
    this.service.list('profissional/estabelecimento/' + JSON.parse(localStorage.getItem("est"))[0].id).subscribe(result => {
      this.profissionaisLista = result;
      this.loading = false;
    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });
  }

  //FICHA ODONTOLOGICA
  selecionatiposFornecimOdonto(item) {
    this.FornecimOdontoSelecionado.idAtendimento = this.object.id;
    this.FornecimOdontoSelecionado.idPaciente = this.object.idPaciente;
    this.FornecimOdontoSelecionado.idFornecimento = item.id;
  }
  selecionatiposVigilanciaSaudeBucal(item) {
    this.VigilanciaSaudeBucalSelecionado.idAtendimento = this.object.id;
    this.VigilanciaSaudeBucalSelecionado.idPaciente = this.object.idPaciente;
    this.VigilanciaSaudeBucalSelecionado.idVigilancia = item.id;
  }
  savetiposFornecimOdonto() {
    this.message = "";
    this.errors = [];
    this.loading = true;

    this.service.savetiposFornecimOdonto(this.FornecimOdontoSelecionado).subscribe(result => {
      this.message = "Registro adicionado com sucesso!"
      this.close();
      this.loading = false;
      this.findtiposFornecimentoOdontoPorAtendimento();
    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });
  }
  savetiposVigilanciaSaudeBucal() {
    this.message = "";
    this.errors = [];
    this.loading = true;

    this.service.savetiposVigilanciaSaudeBucal(this.VigilanciaSaudeBucalSelecionado).subscribe(result => {
      this.message = "Registro adicionado com sucesso!"
      this.close();
      this.loading = false;
      this.findtiposVigilanciaOdontoPorAtendimento();
    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });
  }
  findtiposFornecimentoOdontoPorAtendimento() {
    this.message = "";
    this.errors = [];
    this.loading = true;
    this.service.findtiposFornecimentoOdontoPorAtendimento(this.object.id).subscribe(result => {
      this.allTiposFornecimento = result;
      this.loading = false;
    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });
  }
  findtiposVigilanciaOdontoPorAtendimento() {
    this.message = "";
    this.errors = [];
    this.loading = true;
    this.service.findtiposVigilanciaOdontoPorAtendimento(this.object.id).subscribe(result => {
      this.allTiposVigilanciaBucal = result;
      this.loading = false;
    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });
  }
  removetiposVigilanciaOdontoPorAtendimento(item) {
    this.service.removetiposVigilanciaOdontoPorAtendimento(item.id).subscribe(result => {
      this.message = "Item removido com sucesso!"
      this.loading = false;
      this.findtiposVigilanciaOdontoPorAtendimento();
    });
  }
  removetiposFornecimentoOdontoPorAtendimento(item) {
    this.service.removetiposFornecimentoOdontoPorAtendimento(item.id).subscribe(result => {
      this.message = "Item removido com sucesso!"
      this.loading = false;
      this.findtiposFornecimentoOdontoPorAtendimento();
    });
  }
  carregarCondutaEncaminhamento(id) {
    this.loading = true;
    this.service.list('conduta-encaminhamento/' + id).subscribe(result => {
      this.ListcondutaEncaminhamento = result;
      console.log(result)
      this.loading = false;
    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });
  }
  changeLocal(event) {
    this.localAtendimento = event.target.value
  }
}

