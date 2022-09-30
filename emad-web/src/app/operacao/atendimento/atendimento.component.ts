import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';
import { Atendimento, AtendimentoFiltro } from '../../_core/_models/Atendimento';
import { AppNavbarService } from '../../_core/_components/app-navbar/app-navbar.service';
import { AtendimentoService } from './atendimento.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { environment } from "../../../environments/environment";
import { PagerService } from '../../_core/_services';
import { Usuario } from '../../_core/_models/Usuario';
import { Util } from '../../_core/_util/Util';
import { Translation } from '../../_core/_locale/Translation';
import { isDate } from 'util';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-atendimento',
  templateUrl: './atendimento.component.html',
  styleUrls: ['./atendimento.component.css'],
  providers: [AtendimentoService]
})
export class AtendimentoComponent implements OnInit {

  allItems: any[];
  pager: any = {};
  pagedItems: any[];
  
  message: string = "";
  mensagem: string = "";
  mensagemModal: string = "";
  isFilterCollapse: boolean = false;
  pagerService: PagerService  
  warning: string = "";  
  pageLimit: number = 10;
  totalPages: Number;
  modalRef: NgbModalRef = null;  
  paging: any = {
    offset: 0,
    limit: 10,
    total: 0
  };

  enableSearchButton: any[] = [];
  dropdownList: any[] = [];

  errors: any[] = [];
  showLabels: Boolean = false;
  loading: boolean = false;

  sortColumn: string = 'id';
  sortOrder: string = 'desc';

  //ACTION BUTTONS
  @Input() create: Boolean = true;  
  @Input() view: Boolean = true;  
  @Input() urlForm: string = "atendimentos/cadastro";

  @ViewChild('textoProcurado') textoProcurado: ElementRef;
  @Output() emitFilterMultiSelectMethod = new EventEmitter();
  @ViewChild('content') content: ElementRef;

  method: string = "atendimento";
  domains: any[] = [];
  fields = [];
  fieldsSearch = [];
  object: Atendimento = new Atendimento();
  objectFiltro: AtendimentoFiltro = new AtendimentoFiltro();
  idPaciente: 0;
  armazenaPesquisa: false;
  virtualDirectory: string = environment.virtualDirectory != "" ? environment.virtualDirectory + "/" : "";
  form: FormGroup;
  
  actualPage: Number = 0;
  @Input() methodXls: string = this.method;
  dropdownSettings: any = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Marcar todos',
    unSelectAllText: 'Desmarcar todos',
    searchPlaceholderText: 'Procurar',
    noDataAvailablePlaceholderText: 'Sem dados disponíveis',
    itemsShowLimit: 1,
    allowSearchFilter: true
  };

  constructor(
    public nav: AppNavbarService,
    private service: AtendimentoService,
    private route: ActivatedRoute,
    pagerService: PagerService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private router: Router) {

    for (let field of this.service.fields) {
      if (field.grid) {
        this.fields.push(field);
      }
      if (field.filter && field.filter.grid) {        
        this.fieldsSearch.push(field);
      }
    }
    this.loadDomains();
    this.pagerService = pagerService;   
  }

  ngOnInit() {
    this.nav.show();

    this.route.params.subscribe(params => {
      this.idPaciente = params['idPaciente'];
      this.armazenaPesquisa = params['armazenaPesquisa'];
    });

    if (this.idPaciente>0) {
      this.object.idPaciente = this.idPaciente;      
    }

    if(!this.armazenaPesquisa)
      sessionStorage.setItem("pesquisa_atendimento","");

    this.createGroup();    
    this.preencheFiltro();
  }

  createGroup() {
    this.form = this.fb.group({
      textoProcurado: [''],
      cartaoSus:[''],
      cpf:[''],
      nomePaciente:[''],
      dataCriacaoInicial:[''],
      dataCriacaoFinal:[''],
      situacao:[''],
      idSap:['']
    });
  }

  loadDomains() {      
    this.service.listDomains('estabelecimento').subscribe(estabelecimentos => {
      this.domains.push({
        s: estabelecimentos,
        situacao: [
          { id: "0", nome: "Sala de espera" },
          { id: "C", nome: "Em aberto" },
          { id: "2", nome: "Concluído" },
          { id: "A", nome: "Alta" },          
          { id: "E", nome: "Evasão" },          
          { id: "5", nome: "Transferência hospitalar/ambulatório" },          
          { id: "6", nome: "Transferência unidade prisional" },          
          { id: "7", nome: "Desinternação" },
          { id: "8", nome: "Álvara de soltura" },
          { id: "O", nome: "Óbito" },
          { id: "X", nome: "Cancelado" }
        ]
      });
    });        
  }

  preencheFiltro(){
    let addFilter = sessionStorage.getItem("pesquisa_atendimento").split("&");
    
    addFilter.forEach(filtro => {      
      if(filtro.indexOf("cartaoSus") !== -1){
        var cartaoSus = filtro.split("=");
        this.objectFiltro.cartaoSus = cartaoSus[1];
        this.isFilterCollapse = true;
      }

      if(filtro.indexOf("cpf") !== -1){
        var cpf = filtro.split("=");
        this.objectFiltro.cpf = cpf[1];
        this.isFilterCollapse = true;
      }

      if(filtro.indexOf("nomePaciente") !== -1){
        var nomePaciente = filtro.split("=");
        this.objectFiltro.nomePaciente = nomePaciente[1];
        this.isFilterCollapse = true;
      }

      if(filtro.indexOf("dataCriacaoInicial") !== -1){
        var dataCriacaoInicial = filtro.split("=");
        this.objectFiltro.dataCriacaoInicial = new Date(dataCriacaoInicial[1] + " 04:00:00");
        this.isFilterCollapse = true;
      }

      if(filtro.indexOf("dataCriacaoFinal") !== -1){
        var dataCriacaoFinal = filtro.split("=");
        this.objectFiltro.dataCriacaoFinal = new Date(dataCriacaoFinal[1] + " 23:59:00");
        this.isFilterCollapse = true;
      }

      if(filtro.indexOf("situacao") !== -1){
        var situacao = filtro.split("=");
        this.objectFiltro.situacao = situacao[1];
        this.isFilterCollapse = true;
      }

      if(filtro.indexOf("idSap") !== -1){
        var idSap = filtro.split("=");
        this.objectFiltro.idSap = idSap[1];
        this.isFilterCollapse = true;
      }

      if(filtro.indexOf("pesquisaCentral") !== -1){
        var pesquisaCentral = filtro.split("=");
        this.objectFiltro.pesquisaCentral = pesquisaCentral[1];
      }
    });
  }

  setPagePagined(offset: number, limit: Number) {
    sessionStorage.setItem("pesquisa_atendimento","");
    this.paging.offset = offset !== undefined ? offset : 0;
    this.paging.limit = limit ? limit : this.paging.limit;
    this.getListPaged(this.paging.offset, this.paging.limit);
  }

  getListPaged(offset: Number = null, limit: Number = null) {

    this.message = "";
    this.paging.offset = offset ? offset : 0;
    this.paging.limit = limit ? limit : 10;
    
    if (this.loading != true) {
     setTimeout(() => this.loading = true, 300);
    }

    let sessao = sessionStorage.getItem("pesquisa_atendimento");
    let params = sessao;
    this.errors = [];
    sessionStorage.setItem("pesquisa_atendimento","");

    if(params.length == 0){
      if (this.objectFiltro !== null) {
        if (Object.keys(this.objectFiltro).length) {
          for (let key of Object.keys(this.objectFiltro)) {
            if (this.objectFiltro[key] != "" && this.objectFiltro[key] != 0 && this.objectFiltro[key] != null) {
              if (typeof this.objectFiltro[key] !== "undefined") {
                if (typeof this.objectFiltro[key] == 'object') {
                  if (isDate(this.objectFiltro[key])) {
                    params += key + "=" + Util.dateFormat(this.objectFiltro[key], "yyyy-MM-dd") + "&";
                  } else {
                    let p: string = "";

                    for (let k of this.objectFiltro[key]) {
                      p += k.id + ",";
                    }
                    params += key + "=" + p.substring(0, p.length - 1) + "&";
                  }
                } else {
                  if (this.objectFiltro[key].toString().indexOf('/') >= 0) {
                    params += key + "=" + Util.dateFormat(this.objectFiltro[key], "yyyy-MM-dd") + "&";
                  } else {
                    params += key + "=" + this.objectFiltro[key] + "&";
                  }
                }
              }
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

      if(this.sortColumn) {
        params += (params == "" ? "?" : "&") +  `sortColumn=${this.sortColumn}&sortOrder=${this.sortOrder}`;
      }
    }

    sessionStorage.setItem("pesquisa_atendimento",params);

    this.service.list(this.method + params).subscribe(result => {
      this.warning = "";
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

  pesquisaCentral(){    
    sessionStorage.setItem("pesquisa_atendimento","");
    this.objectFiltro.pesquisaCentral = this.textoProcurado.nativeElement.value;
    this.getListPaged();
  }

  toggleSort(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  }

  new() {
    if (this.urlForm != undefined) {
      this.router.navigate(['/' + this.urlForm]);
    } else {
      let route = this.method.split("/");
      this.router.navigate(['/' + route[0] + '-form']);
    }
  }
 
  viewer(id) {
    this.message = "";
    if (this.urlForm != undefined) {
      this.router.navigate(['/' + this.urlForm + '/' + id]);
    } else {
      let route = this.method.split("/");
      this.router.navigate(['/' + route[0] + '-view/' + id]);
    }
  }

  ngAfterViewInit() {    
    this.getListPaged();
  }

  refresherPagination() {
    this.errors = [];
    this.getListPaged(this.paging.offset, this.paging.limit);
  }

  toggleFilter() {
    this.isFilterCollapse = !this.isFilterCollapse;
  }

  searchFilter() {
    this.mensagem = "";
    sessionStorage.setItem("pesquisa_atendimento","");
    this.getListPaged();
  }

  clear() {
    sessionStorage.setItem("pesquisa_atendimento","");

    if (this.objectFiltro != null) {

      if (Object.keys(this.objectFiltro).length) {
        for (let key of Object.keys(this.objectFiltro)) {

          if (this.objectFiltro[key] != "" && this.objectFiltro[key] != 0) {

            let fields2 = this.fieldsSearch.filter(item => item.field == key);

            if (typeof fields2[0] != 'undefined' && fields2[0] !== null) {
              if (fields2[0].filter.type == "select") {
                if (fields2[0].filter.changeTarget){
                  this.domains[0][fields2[0].filter.changeTarget] = [];
                }
                this.objectFiltro[key] = undefined;
              } else {
                this.objectFiltro[key] = null;
              }
            }
          }
        }
      }
      Util.savePageState(null, 0, null, null, "");
      this.allItems = [];
      this.textoProcurado.nativeElement.value = "";
    }
  }

  loadQuantityPerPagePagination(event) {
    let id = parseInt(event.target.value);
    this.paging.limit = id;

    this.setPagePagined(this.pager.offset, this.paging.limit);
  }

  translate(term, obj) {
    if (typeof (obj) == 'object') {
      return obj[term];
    }
    else {
      return Translation.t(term);
    }
  }

  haveSubmitPermission() {
    return true;
  }

  toCurrency(number, mask) {
    if (number == null) {
      return "";
    }

    if (typeof (mask) == 'object') {
      return Util.convertToCurrency(number);
    } else {
      return number.replace("R$ ", "").replace(".", ",");
    }
  }

  abreFichaDownload(item) {
    let uri = JSON.parse(localStorage.getItem("parametro_seguranca")).filter((url) => url.nome == "URL_FICHA_MEDICA_IMPRESSAO")
              ?
              JSON.parse(localStorage.getItem("parametro_seguranca")).filter((url) => url.nome == "URL_FICHA_MEDICA_IMPRESSAO")[0].valor
              :"";

    uri = uri.replace("{id}", item.id);
    
    this.loading = true;
    this.service.enviaFicha(item).subscribe(result=>{  
      this.service.file("atendimento/print-document", uri).subscribe(result=>{
        this.loading = false;
        window.open(
          uri,
          '_blank'
          );
      });
    });
    this.loading = false;
  }

  abreFichaVisualizacao(item) {
    let uri = JSON.parse(localStorage.getItem("parametro_seguranca")).filter((url) => url.nome == "URL_FICHA_MEDICA_VISUALIZACAO")
              ?
              JSON.parse(localStorage.getItem("parametro_seguranca")).filter((url) => url.nome == "URL_FICHA_MEDICA_VISUALIZACAO")[0].valor
              :"";

    uri = uri.replace("{id}", item.id);

    this.loading = true;

    this.service.file("atendimento/open-document", uri).subscribe(result=>{
      this.loading = false;
      window.open(
        uri,
        '_blank'
      );
    });
    this.loading = false;
  }

  abreReceitaMedica(item) {      
    if(!item.numero_receita || item.numero_receita == 0){   
      this.openConfirmacao(this.content);        
      this.mensagemModal = "Receita não encontrada";
      return;
    }

    let uri = this.router.url.replace('atendimentos','') + this.virtualDirectory + "#/atendimentos/relatorio-receita/{ano_receita}/{unidade_receita}/{numero_receita}/false";

    if(item.ano_receita)
      uri = uri.replace("{ano_receita}", item.ano_receita);

    if(item.numero_receita)
      uri = uri.replace("{numero_receita}", item.numero_receita);

    if(item.unidade_receita)
      uri = uri.replace("{unidade_receita}", item.unidade_receita);

    this.loading = true;

    this.service.file("atendimento/receita-medica", uri).subscribe(result=>{
      this.loading = false;
      window.open(
        uri,
        '_blank'
      );
    });
    this.loading = false;
  }

  close() {
    if(this.modalRef)
      this.modalRef.close();
  }

  openConfirmacao(content: any) {
    this.modalRef = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: "sm"
    });
  }

  sort(field: string): void {
    if(this.sortColumn === field){
      this.toggleSort();
    }

    this.sortColumn = field;
  
    this.getListPaged(this.paging.offset, this.paging.limit);
  }
}
