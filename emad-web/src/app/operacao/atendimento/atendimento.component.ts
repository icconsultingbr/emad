import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';
import { Atendimento } from '../../_core/_models/Atendimento';
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
  
  token: string = "";
  message: string = "";
  mensagem: string = "";
  classMensagem: string = "";
  mensagemModal: string = "";
  closeResult: string;
  @Input() loading: boolean = false;
  isFilterCollapse: boolean = false;
  pagerService: PagerService
  user: Usuario = new Usuario();
  warning: string = "";
  motivoExclusao: string = '';
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
  
  //ACTION BUTTONS

  @Input() create: Boolean = true;  
  @Input() view: Boolean = true;
  @Input() refresh: Boolean = true;
  @Input() callbackLoadList: any;
  @Input() urlForm: string = "atendimentos/cadastro";

  @ViewChild('textoProcurado') textoProcurado: ElementRef;
  @Output() emitFilterMultiSelectMethod = new EventEmitter();
  @ViewChild('content') content: ElementRef;

  method: string = "atendimento";
  domains: any[] = [];
  fields = [];
  fieldsSearch = [];
  object: Atendimento = new Atendimento();
  idPaciente: 0;
  virtualDirectory: string = environment.virtualDirectory != "" ? environment.virtualDirectory + "/" : "";

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
    });

    if (this.idPaciente>0) {
      this.object.idPaciente = this.idPaciente;      
    }

    if (typeof Util.getPageState('textoProcurado') != 'undefined') {
      this.textoProcurado.nativeElement.value = Util.getPageState('textoProcurado');
    }
  }

  loadDomains() {      
    this.service.listDomains('estabelecimento').subscribe(estabelecimentos => {
      this.domains.push({
        s: estabelecimentos,
        situacao: [
          { id: "C", nome: "Em aberto" },
          { id: "A", nome: "Alta" },          
          { id: "E", nome: "Evasão" },
          { id: "O", nome: "Óbito" },
          { id: "X", nome: "Cancelado" }
        ]
      });
    });        
  }

  setPage(page: number) {
    this.pager = this.pagerService.getPager(this.allItems.length, page, this.pageLimit);
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  setPagePagined(offset: number, limit: Number) {
    this.paging.offset = offset !== undefined ? offset : 0;
    this.paging.limit = limit ? limit : this.paging.limit;
    this.getListPaged(this.paging.offset, this.paging.limit);
  }


  checkDomains() {

    setTimeout(() => this.loading = true, 100);

    if (this.domains && this.domains.length) {

      setTimeout(() => {
        this.loading = false;
        this.loadContent();
      }, 100);
    }
    else {

      if (this.errors.length) {
        this.loading = false;
      }
      else {
        setTimeout(() => {
          this.checkDomains();
        }, 1000);
      }
    }
  }

  getListPaged(offset: Number = null, limit: Number = null) {

    this.message = "";
    this.paging.offset = offset ? offset : 0;
    this.paging.limit = limit ? limit : 10;

    if (this.loading != true) {
      setTimeout(() => this.loading = true, 300);
    }

    let params = "";
    this.errors = [];

    if (this.object !== null) {
      if (Object.keys(this.object).length) {
        for (let key of Object.keys(this.object)) {
          if (this.object[key] != "" && this.object[key] != 0 && this.object[key] != null) {
            if (typeof this.object[key] !== "undefined") {
              if (typeof this.object[key] == 'object') {
                if (isDate(this.object[key])) {
                  params += key + "=" + Util.dateFormat(this.object[key], "yyyy-MM-dd") + "&";
                } else {
                  let p: string = "";

                  for (let k of this.object[key]) {
                    p += k.id + ",";
                  }
                  params += key + "=" + p.substring(0, p.length - 1) + "&";
                }
              } else {
                if (this.object[key].toString().indexOf('/') >= 0) {
                  params += key + "=" + Util.dateFormat(this.object[key], "yyyy-MM-dd") + "&";
                } else {
                  params += key + "=" + this.object[key] + "&";
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

    this.service.list(this.method + params).subscribe(result => {
      this.warning = "";
      this.paging.total = result.total;
      this.totalPages = Math.ceil((this.paging.total / this.paging.limit));
      this.allItems = result.items;

      setTimeout(() => {
        this.loading = false;
        this.savePageState();

      }, 300);
    }, erro => {
      setTimeout(() => this.loading = false, 300);
      this.errors = Util.customHTTPResponse(erro);
    });
  }

  new() {
    if (this.urlForm != undefined) {
      this.router.navigate(['/' + this.urlForm]);
    } else {
      let route = this.method.split("/");
      this.router.navigate(['/' + route[0] + '-form']);
    }
  }

  alter(item) {

    this.message = "";
    let compoundKey: any[] = [];

    for (let field of this.fields) {

      if (field.compoundKey) {
        compoundKey = field.compoundKey;
      }
    }

    if (compoundKey.length) {

      let uri: string = "";

      for (let ck of compoundKey) {
        uri += "/" + item[ck.field];
      }

      if (this.urlForm != undefined) {
        this.router.navigate(['/' + this.urlForm + uri]);
      } else {
        let route = this.method.split("/");
        this.router.navigate(['/' + route[0] + '-form' + uri]);
      }
    } else {
      if (this.urlForm != undefined) {
        this.router.navigate(['/' + this.urlForm + '/' + item.id]);
      } else {
        let route = this.method.split("/");
        this.router.navigate(['/' + route[0] + '-form/' + item.id]);
      }

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
    if (this.domains) {
      this.checkDomains();
    } else {
      this.loadContent();
    }
  }

  refresherPagination() {
    this.errors = [];
    this.getListPaged(this.paging.offset, this.paging.limit);
  }

  toggleFilter() {
    this.isFilterCollapse = !this.isFilterCollapse;
  }

  loadDomain(route: string, event, object: any) {
    this.message = "";
    let id = event.target.value;
    this.listDomain(route, id, object);
  }

  listDomain(route, id, object) {
    if (id[0] != 0) {
      if (this.loading != true) {
        this.loading = true;
      }


      this.service.list(route + "/" + id).subscribe(result => {

        for (let field of this.fieldsSearch) {
          if (field.field == object) {

            if (result[field.returnedObject]) {
              this.domains[0][object] = result[field.returnedObject];
            }
            else {
              this.domains[0][object] = result;
            }
          }
        }
        if (this.loading == true) {
          setTimeout(() => this.loading = false, 300);
        }
      }, error => {
        this.mensagem = Translation.t("ERROR_RESULT");
        setTimeout(() => this.loading = false, 300);
      });
    }
    else {
      this.domains[0][object] = [];
    }
  }

  searchFilter() {
    this.mensagem = "";
    this.getListPaged();
  }

  clear() {

    if (this.object != null) {

      if (Object.keys(this.object).length) {
        for (let key of Object.keys(this.object)) {

          if (this.object[key] != "" && this.object[key] != 0) {

            let fields2 = this.fieldsSearch.filter(item => item.field == key);

            if (typeof fields2[0] != 'undefined' && fields2[0] !== null) {
              if (fields2[0].filter.type == "select") {
                if (fields2[0].filter.changeTarget){
                  this.domains[0][fields2[0].filter.changeTarget] = [];
                }
                this.object[key] = undefined;
              } else {
                this.object[key] = null;
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


  loadContent() {
    this.getListPaged();

    if (Util.getPageState('route') == this.method) {

      if (Util.getPageState('domains') !== 'undefined') {
        this.domains = JSON.parse(Util.getPageState('domains'));
      }

      this.object = JSON.parse(Util.getPageState('object'));

      if (this.loading == true) {
        this.loading = false;
      }

      this.setPagePagined(parseInt(Util.getPageState('page')), this.paging.limit);

      //this.emitAlterXlsMethod.emit(this.object);
    }
  }

  savePageState() {

    Util.savePageState(
      this.object,
      (this.pager.currentPage !== undefined ? this.pager.currentPage : this.paging.offset),
      this.method,
      this.domains,
      this.textoProcurado.nativeElement.value
    );
  }

  checkRequiredFields() {
    this.enableSearchButton = [];

    for (let field of this.fieldsSearch) {
      if (field.filter) {
        if (field.filter.required) {

          //console.log(field.field, this.object[field.field]);
          if (this.object[field.field] !== undefined && this.object[field.field] != null) {
            if (typeof this.object[field.field] == 'object') {
              if (field.type == "date" || field.type == "dateTime") {
                this.enableSearchButton.push(true);
              } else {
                if (this.object[field.field].length) {
                  this.enableSearchButton.push(true);
                } else {
                  this.enableSearchButton.push(false);
                }
              }
            } else {
              this.enableSearchButton.push(true);
            }
          }
          else {
            this.enableSearchButton.push(false);
          }
        }
      }
    }

    if (this.enableSearchButton.length && this.enableSearchButton.includes(false)) {
      return false;
    }

    return true;
  }

  changeTextoProcurado() {
    this.savePageState();
  }

  filterMultiSelectMethod(field, value) {
    if (typeof field !== "undefined" && typeof value !== "undefined" && field !== null && value !== null) {
      this.emitFilterMultiSelectMethod.emit({ field: field, value: value });
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
}
