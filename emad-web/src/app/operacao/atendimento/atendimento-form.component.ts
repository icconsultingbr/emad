import { Component, OnInit, ViewChild } from '@angular/core';
import { AtendimentoService } from './atendimento.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PagerService } from '../../_core/_services';
import { Router, ActivatedRoute } from '@angular/router';
import { Atendimento } from '../../_core/_models/Atendimento';
import { Paciente } from '../../_core/_models/Paciente';
import { Util } from '../../_core/_util/Util';
import { PlanoTerapeuticoService } from '../plano-terapeutico/plano-terapeutico.service';
import { PacienteHipotese } from '../../_core/_models/PacenteHipotese';
import { Encaminhamento } from '../../_core/_models/Encaminhamento';
import { isObject } from 'util';
import { AtendimentoMedicamento } from '../../_core/_models/AtendimentoMedicamento';
import { MedicamentoDim } from '../../_core/_models/MedicamentoDim';

@Component({
  selector: 'app-atendimento-form',
  templateUrl: './atendimento-form.component.html',
  styleUrls: ['./atendimento-form.component.css'],
  providers: [AtendimentoService, PlanoTerapeuticoService]
})
export class AtendimentoFormComponent implements OnInit {
  
  @ViewChild('contentConfirmacao') contentConfirmacao: any;
  
  loading: Boolean = false;
  message: String = "";
  errors: any[] = [];
  modalRef: NgbModalRef = null;

  //FORMS
  form: FormGroup;
  formHipotese: FormGroup;
  formMedicamento: FormGroup;

  method: String = "atendimento";
  url: String = "atendimentos";
  object: Atendimento = new Atendimento();
  paciente: Paciente = new Paciente();
  pacienteHipotese: PacienteHipotese = new PacienteHipotese();
  encaminhamento: Encaminhamento = new Encaminhamento();
  atendimentoMedicamento: AtendimentoMedicamento = new AtendimentoMedicamento();
  medicamentoDim: MedicamentoDim = new MedicamentoDim();

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
  allMedicamentosDim: any[] = [];
  removeId: Number;

  id: Number;

  constructor(
    private service: AtendimentoService,
    private pagerService: PagerService,
    private pacienteService: PlanoTerapeuticoService,
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

      this.createGroup();
      this.loadDomains();

      if (!Util.isEmpty(this.id)) {
        this.encontraAtendimento();
      }
    });
  }

  createGroup() {
    this.form = this.fb.group({
      id: [''],
      idPaciente: [Validators.required],
      pacienteNome: [Validators.required],
      pressaoArterial: ['', ''],
      pulso: ['', ''],
      saturacao: ['', ''],
      temperatura: ['', ''],
      altura: ['', ''],
      peso: ['', ''],
      historicoClinico: ['', ''],
      historiaProgressa: ['', ''],
      exameFisico: ['', ''],
      observacoesGerais: ['', ''],
      situacao: [Validators.required],
      motivoCancelamento: ['',''],
      idEstabelecimento: [Validators.required],
      tipoFicha: [Validators.required],
      motivoQueixa: ['','']
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

  buscaPaciente() {
    this.loading = true;
    let params = "";
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

    this.service.list('paciente' + params).subscribe(result => {

      this.allItems = result;
      this.setPage(1);
      this.loading = false;

    }, erro => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(erro);
    });
  }

  buscaMedicamento() {
    this.loading = true;
    let params = "";
    this.allMedicamentosDim = [];

    if (Util.isEmpty(this.medicamentoDim.descricao) || this.medicamentoDim.descricao.length<3)
    {
      this.errors = [{message:"Informe a descrição do medicamento, ao menos 3 caracteres"}];
      this.loading = false;
      return;
    }
    
    params = "?descricao=" + this.medicamentoDim.descricao;

    this.service.list('medicamento/dim' + params).subscribe(result => {
      this.allMedicamentosDim = result;
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
    this.medicamentoDim.descricao = "";
    this.medicamentoSelecionado = null;    
    this.allMedicamentosDim = [];

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
      this.loading = false;

      this.findHipotesePorAtendimento();
      this.findEncaminhamentoPorAtendimento();
      this.findMedicamentoPorAtendimento();

    }, error => {
      this.object = new Atendimento();
      this.object.idPaciente = this.pacienteSelecionado.id;
      this.object.pacienteNome = this.pacienteSelecionado.nome;
      this.loading = false;

      this.allItemsEncaminhamento = [];
      this.allItemsHipotese = [];
      this.allItemsMedicamento = [];

      this.errors.push({
        message: "Atendimento não encontrado"
      });
    });
  }

  sendForm(event) {
    this.errors = [];
    this.message = "";
    this.loading = true;
    event.preventDefault();

    if(this.object.situacao == "E" || this.object.situacao == "O"){
      this.stopProcess(this.object.situacao);
      return;
    }      

    if(this.object.situacao == "X"){
      this.stopProcess('X');
      return;
    }

    this.service
      .save(this.form.value, this.method)
      .subscribe(res => {

        this.object.id = res.id;
        if(res.ano_receita)        
          this.object.ano_receita = res.ano_receita;

        if(res.numero_receita)
          this.object.numero_receita = res.numero_receita;

        if(res.unidade_receita)
          this.object.unidade_receita = res.unidade_receita;

        if (this.form.value.id) {
          this.message = "Alteração efetuada com sucesso!";

          if(!Util.isEmpty(this.object.ano_receita) && !Util.isEmpty(this.object.numero_receita) && !Util.isEmpty(this.object.unidade_receita))
            this.abreReceitaMedica(this.object.ano_receita, this.object.numero_receita, this.object.unidade_receita);
        } else {
          this.abreFichaDigital(this.object.id);
        }

        if(!this.message)
        {
          this.message = "Cadastro efetuado com sucesso!";
          this.openConfirmacao(this.contentConfirmacao);
        }

        if(this.object.situacao == "A"){
          this.stopProcess('A');
          return;
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

      this.object = result;
      this.object.pacienteNome = this.pacienteSelecionado.nome;
      this.loading = false;

      this.findHipotesePorAtendimento();
      this.findEncaminhamentoPorAtendimento();
      this.findMedicamentoPorAtendimento();

    }, error => {
      this.object = new Atendimento();
      this.object.idPaciente = this.pacienteSelecionado.id;
      this.object.pacienteNome = this.pacienteSelecionado.nome;
      this.loading = false;

      this.allItemsEncaminhamento = [];
      this.allItemsHipotese = [];
      this.allItemsMedicamento = [];

      this.errors.push({
        message: "Atendimento não encontrado"
      });
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

  close() {
    this.modalRef.close();
  }

  loadDomains() {
    this.loading = true;
    this.service.listDomains('hipotese-diagnostica').subscribe(hipoteses => {
        this.service.listDomains('especialidade').subscribe(especialidades => {            
                this.domains.push({
                  hipoteses: hipoteses,
                  especialidades: especialidades,
                  tipoFichas: []
          });
      });
      this.loading = false;
      this.buscaTipoFicha();
    });
  }

  buscaTipoFicha() {
    this.loading = true;
       this.service.list('tipo-ficha').subscribe(result => {
        if(!this.domains[0].tipoFichas)
          this.loadDomains();
        else
          this.domains[0].tipoFichas = result;
          
        this.loading = false;
      }, error => {
        this.loading = false;
        this.errors = Util.customHTTPResponse(error);
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

    this.atendimentoMedicamento.idMaterialDim = this.medicamentoSelecionado.id_material;
    this.atendimentoMedicamento.descricaoMaterialDim = this.medicamentoSelecionado.descricao;

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

  canStop() {
    return (this.object.id && Util.isEmpty(this.object.dataCancelamento) && Util.isEmpty(this.object.dataFinalizacao))
  }

  stopProcess(val: String) {
    this.message = "";
    this.errors = [];
    let obj: any = {};
    obj.id = this.object.id;
    obj.tipo = val;
    obj.motivoCancelamento = this.object.motivoCancelamento;

    this.loading = true;
    this.service.stopProcess(obj).subscribe(result => {
      this.loading = false;
      this.message = (val == 'X') ? "Atendimento cancelado com sucesso" : "Atendimento finalizado com sucesso!";
      this.object = new Atendimento();
    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
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


  abreFichaDigital(id: Number) {
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

  abreReceitaMedica(ano_receita: Number, numero_receita: Number, unidade_receita: Number) {
    this.errors = [];
    let url =
      JSON.parse(localStorage.getItem("parametro_seguranca")).filter((url) => url.nome == "URL_RECEITA_MEDICA_VISUALIZACAO")
      ?
      JSON.parse(localStorage.getItem("parametro_seguranca")).filter((url) => url.nome == "URL_RECEITA_MEDICA_VISUALIZACAO")[0].valor
      .replace('{ano_receita}', ano_receita)
      .replace('{numero_receita}', numero_receita)
      .replace('{unidade_receita}', unidade_receita)
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
}