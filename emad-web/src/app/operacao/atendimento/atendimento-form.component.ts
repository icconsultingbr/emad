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
import { PacienteHipotese } from '../../_core/_models/PacenteHipotese';
import { Encaminhamento } from '../../_core/_models/Encaminhamento';
import { AtendimentoMedicamento } from '../../_core/_models/AtendimentoMedicamento';
import { Material } from '../../_core/_models/Material';
import { ReciboReceitaImpressaoService } from '../../shared/services/recibo-receita-impressao.service';
import { environment } from '../../../environments/environment';

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

  //FORMS
  form: FormGroup;
  formHipotese: FormGroup;
  formMedicamento: FormGroup;

  method: string = "atendimento";
  url: string = "atendimentos";
  object: Atendimento = new Atendimento();
  paciente: Paciente = new Paciente();
  pacienteHipotese: PacienteHipotese = new PacienteHipotese();
  encaminhamento: Encaminhamento = new Encaminhamento();
  atendimentoMedicamento: AtendimentoMedicamento = new AtendimentoMedicamento();
  medicamento: Material = new Material();
  atendimentoHistorico: AtendimentoHistorico = new AtendimentoHistorico(); 
  virtualDirectory: string = environment.virtualDirectory != "" ? environment.virtualDirectory + "/" : "";
  
  pacienteSelecionado: any = null;
  medicamentoSelecionado: any = null;
  domains: any[] = [];

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

      this.createGroup();
      this.loadDomains();
    });
  }

  createGroup() {
    this.form = this.fb.group({
      id: [''],
      idPaciente: [Validators.required],
      pacienteNome: [Validators.required],
      pacienteHistoriaProgressa: ['',''],
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
      motivoCancelamento: ['',''],
      idEstabelecimento: [Validators.required],
      tipoFicha: new FormControl({value: '', disabled: (this.idHistorico > 0) ? true : false}, Validators.required),
      idClassificacaoRisco: new FormControl({value: '', disabled: (this.idHistorico > 0) ? true : false}, Validators.required),
      motivoQueixa: ['',''],
      tipoHistoriaClinica: new FormControl({value: '', disabled: (this.idHistorico > 0) ? true : false}),
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

  buscaMedicamento() {
    this.loading = true;
    let params = "";
    this.allMedicamentos = [];

    if (Util.isEmpty(this.medicamento.descricao) || this.medicamento.descricao.length<3)
    {
      this.errors = [{message:"Informe a descrição do medicamento, ao menos 3 caracteres"}];
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

  open(content: any) {

    this.clear();
    this.pacienteSelecionado = null;

    this.allItems = [];

    this.modalRef = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: "lg"
    });
  }

  openHipotese(content: any) {
    this.errors = [];
    this.message = "";
    this.pacienteHipotese = new PacienteHipotese();
    this.pacienteHipotese.idPaciente = this.object.idPaciente;
    this.pacienteHipotese.idAtendimento = this.object.id;

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
      size: "lg"
    });
  }

  openConfirmacao(content: any) {
    this.modalRef = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: "lg"
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

  selecionaMedicamento(item) {
    this.medicamentoSelecionado = item;
  }

  confirmaPaciente() {
    this.object.idPaciente = this.pacienteSelecionado.id;
    this.object.pacienteNome = this.pacienteSelecionado.nome;
    this.object.pacienteHistoriaProgressa = this.pacienteSelecionado.historiaProgressaFamiliar;
    this.close();

    this.findPacienteData(this.object.idPaciente);
  }

  encontraAtendimento(idHistorico: number) {
    this.object.id = this.id;
    this.errors = [];
    this.message = "";
    this.loading = true;

    if(idHistorico){
      this.service.findByHistoricoId(idHistorico).subscribe(result => {
        this.object = result;
        this.dataHistorico = result.dataHistorico;
        this.nomeProfissional = result.nomeProfissional;
        this.nomeTipoHistorico = result.nomeTipoHistorico;
        this.object.pacienteNome = result.nome;
        this.object.pacienteHistoriaProgressa = result.pacienteHistoriaProgressa;
        this.loading = false;
  
        this.findHipotesePorAtendimento();
        this.findEncaminhamentoPorAtendimento();
        this.findMedicamentoPorAtendimento();
        this.findHistoricoPorAtendimento();
  
      }, error => {
        this.object = new Atendimento();  
        this.allItemsEncaminhamento = [];
        this.allItemsHipotese = [];
        this.allItemsMedicamento = [];
  
        this.errors.push({
          message: "Atendimento histórico não encontrado"
        });
      });
    }
    else{
      this.service.findById(this.id, this.method).subscribe(result => {
        this.object = result;
        this.object.pacienteNome = result.nome;
        this.object.pacienteHistoriaProgressa = result.pacienteHistoriaProgressa;
        this.loading = false;
  
        this.findHipotesePorAtendimento();
        this.findEncaminhamentoPorAtendimento();
        this.findMedicamentoPorAtendimento();
        this.findHistoricoPorAtendimento();
  
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
  }

  sendForm(event) {
    this.errors = [];
    this.message = "";
    this.loading = true;
    event.preventDefault();

    this.service
      .save(this.form.value, this.method)
      .subscribe((res: any) => {
        this.object.id = res.id;
        this.findHistoricoPorAtendimento();
        if(res.ano_receita)        
          this.object.ano_receita = res.ano_receita;

        if(res.numeroReceita)
          this.object.numero_receita = res.numeroReceita;

        if(res.idEstabelecimento)
          this.object.unidade_receita = res.idEstabelecimento;

        if(res.dadosFicha)
          this.object.dadosFicha = res.dadosFicha;

        if (this.form.value.id) {
          this.message = "Atendimento alterado com sucesso";

          if(!Util.isEmpty(this.object.ano_receita) && !Util.isEmpty(this.object.numero_receita) && !Util.isEmpty(this.object.unidade_receita))
            this.abreReceitaMedica(this.object.ano_receita, this.object.numero_receita, this.object.unidade_receita);
        } else {
          this.abreFichaDigital(this.object.id, false);
        }

        if(!this.message)
        {
          this.message = "Cadastro efetuado com sucesso!";
          this.openConfirmacao(this.contentConfirmacao);
        }

        if(this.object.situacao){
          if(this.object.situacao == 'X'){
            this.message = "Atendimento cancelado com sucesso";
            this.object = new Atendimento();
          }
          else if(this.object.situacao == 'C')
            this.message = "Atendimento alterado com sucesso"          
          else{
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

      if(result){
        this.object = result;
        this.object.pacienteNome = this.pacienteSelecionado.nome;
        this.object.pacienteHistoriaProgressa = this.pacienteSelecionado.historiaProgressaFamiliar;
        this.loading = false;
  
        this.findHipotesePorAtendimento();
        this.findEncaminhamentoPorAtendimento();
        this.findMedicamentoPorAtendimento();
        this.findHistoricoPorAtendimento();
      }
      else
        this.limpaAtendimento();
    }, error => {
      this.limpaAtendimento();
    });
  }

  limpaAtendimento(){
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

  close() {
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
              this.encontraAtendimento(null);
            }
            else if(!Util.isEmpty(this.idHistorico))
              this.encontraAtendimento(this.idHistorico);
            else
              this.loading = false;
            });
          });
        });
      });
    });
  }
  
  disableHipoteseButton() {
    return Util.isEmpty(this.pacienteHipotese.idHipoteseDiagnostica) || Util.isEmpty(this.pacienteHipotese.idPaciente);
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
      this.modalRef.close();
      this.loading = false;
      this.findHipotesePorAtendimento();
    });
  }

  removeEncaminhamento(item) {
    this.service.removeEncaminhamento(item.id).subscribe(result => {
      this.message = "Encaminhamento removido com sucesso!"
      this.modalRef.close();
      this.loading = false;
      this.findEncaminhamentoPorAtendimento();
    });
  }

  removeMedicamento(item) {
    this.service.removeMedicamento(item.id).subscribe(result => {
      this.message = "Medicamento removido com sucesso!"
      this.modalRef.close();
      this.loading = false;
      this.findMedicamentoPorAtendimento();
    });
  }

  disableFields(): boolean {
    if (!this.object) {
      return true;
    } else {
      if (Util.isEmpty(this.object.dataFinalizacao) && Util.isEmpty(this.object.dataCancelamento) && Util.isEmpty(this.idHistorico)) {
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

  abreReceitaMedica(ano_receita: number, numero_receita: number, unidade_receita: number) {
    this.reciboReceitaService.imprimir(ano_receita, unidade_receita, numero_receita, false);
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
}