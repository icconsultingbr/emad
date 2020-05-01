import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AtribuicaoCanetaService } from './atribuicao-caneta.service';
import { Paciente } from '../../_core/_models/Paciente';
import { PagerService } from '../../_core/_services';
import { Util } from '../../_core/_util/Util';
import { Router } from '@angular/router';
import { AgendaProfissional } from '../../_core/_models/AgendaProfissional';
import { environment } from "../../../environments/environment";
import { AtendimentoService } from '../atendimento/atendimento.service';
import { AtribuicaoCaneta } from '../../_core/_models/AtribuicaoCaneta';

@Component({
  selector: 'app-atribuicao-caneta',
  templateUrl: './atribuicao-caneta.component.html',
  styleUrls: ['./atribuicao-caneta.component.css'],
  providers: [AtribuicaoCanetaService, AtendimentoService]
})
export class AtribuicaoCanetaComponent implements OnInit {

  //MESSAGES
  loading: Boolean = false;
  message: String = "";
  errors: any[] = [];
  modalRef: NgbModalRef = null;
  modalRemoveRef: NgbModalRef = null;
  form: FormGroup;
  method: String = "agenda";

  //PAGINATION
  allItems: any[];
  pager: any = {};
  pagedItems: any[];
  pageLimit: number = 10;
  fields: any[] = [];
  agendas: any[] = [];

  historicoAtribuicoes: any[] = [];

  @ViewChild('contentScheduler') contentScheduler: ElementRef;
  selectedSchedule : any = null;
  @Input() readonly : Boolean = false;


  //MODELS (OBJECTS)
  object: AtribuicaoCaneta = new AtribuicaoCaneta();

  pacienteSelecionado: any = null;
  domains: any[] = [];

  constructor(
    private pagerService: PagerService,
    private fb: FormBuilder,
    private service: AtribuicaoCanetaService,
    private serviceAtendimento: AtendimentoService,
    private modalService: NgbModal,
    private router: Router) {

    for (let field of this.service.fields) {
      if (field.grid) {
        this.fields.push(field);
      }
    }
  }

  ngOnInit() {
    this.loadDomains();
    this.buscaProfissionais();   
    this.createGroup();
  }

  open(content: any) {


    this.clear();
    this.pacienteSelecionado = null;

    /*this.object.idPaciente = null;
    this.object.pacienteNome = null;*/
    this.allItems = [];

    this.modalRef = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: "lg"
    });
  }

  openRemoveSchedule(content: any) {
    this.modalRemoveRef = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: "sm"
    });
  }

  close() {
    //this.modalRef.close();
  }

  removeCancel() {
    this.modalRemoveRef.close();
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
    
    this.allItems = [];
    this.historicoAtribuicoes = [];
    this.object.idProfissional = 0;
  }

  clearAtribuicao() {    
    this.form.value.horarioInicial = "";
    this.form.value.horarioFinal = "";
    this.form.value.dataAtribuicao = "";
    this.domains[0].idCaneta = [];
    this.object.idCaneta = 0;
  }

  findHistoricoAtribuicoesPorProfissional() {
    this.message = "";
    this.errors = [];
    this.loading = true;
    this.service.findHistoricoAtribuicaoByProfissional(this.object.idProfissional).subscribe(result => {
      this.historicoAtribuicoes = result;
      this.loading = false;
    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });
  }

  removeAtribuicao(item) {
    this.service.removeAtribuicao(item.id).subscribe(result => {
      this.message = "Atribuição removida com sucesso!"
      this.loading = false;
      this.findHistoricoAtribuicoesPorProfissional();
      this.clearAtribuicao();
    });
  }

  saveAtribuicao() {
    this.message = "";
    this.errors = [];
    this.loading = true;

    this.service.saveAtribuicao(this.object).subscribe(result => {
      this.message = "Atribuição inserida com sucesso!"
      this.loading = false;
      this.clearAtribuicao();
      this.findHistoricoAtribuicoesPorProfissional();            
    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });
  }

  loadDomains() {
    this.domains.push({
      equipe: [
        { id: "EMAD", nome: "EMAD" },
        { id: "EMAP", nome: "EMAP" }
      ],
      idEquipe: [],
      idCaneta: []
    });  
  }

  createGroup() {
    this.form = this.fb.group({
      id: [''],
      idPaciente: [Validators.required],
      pacienteNome: [Validators.required],
      dataAtribuicao: ['', ''],
      horarioInicial: ['', ''],
      horarioFinal: ['', ''],
      idEquipe: ['', ''],
      idCaneta: ['', ''],
      equipe: ['', ''],
      idProfissional: ['', ''],
      historiaProgressa: ['', ''],
      exameFisico: ['', ''],
      observacoesGerais: ['', ''],
      situacao: [Validators.required],
      idEstabelecimento: [Validators.required],
      tipoFicha: [Validators.required],
    });
  }

  buscaProfissionais() {
    this.loading = true;
       this.service.list('profissional/estabelecimento/' + JSON.parse(localStorage.getItem("est"))[0].id).subscribe(result => {
        this.domains[0].idProfissional = result;
        this.loading = false;
      }, error => {
        this.loading = false;
        this.errors = Util.customHTTPResponse(error);
      });
  }

  carregarCanetasDisponiveis() {
    if (!Util.isEmpty(this.form.value.horarioInicial) && !Util.isEmpty(this.form.value.horarioFinal) && !Util.isEmpty(this.form.value.dataAtribuicao))
    {     
        var periodoinicial = new Date(this.form.value.dataAtribuicao.getFullYear(),
                               this.form.value.dataAtribuicao.getMonth(),                                
                               this.form.value.dataAtribuicao.getDate(),                               
                               this.form.value.horarioInicial.substring(2,0),
                               this.form.value.horarioInicial.substring(3),
                               0);

        var periodofinal = new Date(this.form.value.dataAtribuicao.getFullYear(),
                               this.form.value.dataAtribuicao.getMonth(),                                
                               this.form.value.dataAtribuicao.getDate(),                               
                               this.form.value.horarioFinal.substring(2,0),
                               this.form.value.horarioFinal.substring(3),
                               0);

        var dateInicialFormatada;
        var dateFinalFormatada;

        dateInicialFormatada = periodoinicial.getFullYear() + "-" + this.twoDigits(1 + periodoinicial.getMonth()) + "-" + 
        this.twoDigits(periodoinicial.getDate()) + " " + 
        this.twoDigits(periodoinicial.getHours()) + ":" + 
        this.twoDigits(periodoinicial.getMinutes()) + ":" + 
        this.twoDigits(periodoinicial.getSeconds());
    
          dateFinalFormatada = periodofinal.getFullYear() + "-" + this.twoDigits(1 + periodofinal.getMonth()) + "-" + 
                                                         this.twoDigits(periodofinal.getDate()) + " " + 
                                                         this.twoDigits(periodofinal.getHours()) + ":" + 
                                                         this.twoDigits(periodofinal.getMinutes()) + ":" + 
                                                         this.twoDigits(periodofinal.getSeconds());

        this.object.periodoInicial = dateInicialFormatada;
        this.object.periodoFinal = dateFinalFormatada;

        this.loading = true;
        this.service.list('caneta/estabelecimento/' + JSON.parse(localStorage.getItem("est"))[0].id + '/' +  dateInicialFormatada  + '/' + dateFinalFormatada).subscribe(result => {
        this.domains[0].idCaneta = result;
        this.loading = false;
      }, error => {
        this.loading = false;
        this.errors = Util.customHTTPResponse(error);
      });

    }
  }

  twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
  }

  back() {
    this.router.navigate([this.method]);
  }

  isValid() {

    let bool: Boolean = false;


    return bool;
  }



  convertTodate(date){
    if(!Util.isEmpty(date)){
      let data = new Date(date);
      return data.setHours(data.getHours() + (environment.utc));
    }

    return null;
  }

  getInitials(nome : String){
    return Util.getInitialsOfName(nome)[0] + "" + Util.getInitialsOfName(nome)[Util.getInitialsOfName(nome).length-1];
  }

}