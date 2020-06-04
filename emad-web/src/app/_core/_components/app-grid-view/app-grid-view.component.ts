import { Component, OnInit, Input, AfterViewInit, ViewChild, Output, ElementRef, EventEmitter } from '@angular/core';
import { AppGridViewService } from './app-grid-view.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { PagerService } from '../../_services';
import { Usuario } from '../../_models/Usuario';
import { AuthGuard } from '../../_guards';
import { Translation } from '../../_locale/Translation';
import { Util } from '../../_util/Util';
import { isDate } from 'util';
import { PreviousRouteService } from '../../_services/previous-router.service';

@Component({
  moduleId: module.id,
  selector: 'app-grid-view',
  templateUrl: './app-grid-view.component.html',
  styleUrls: ['./app-grid-view.component.css']
})
export class AppGridViewComponent implements AfterViewInit {

  allItems: any[];
  pager: any = {};
  pagedItems: any[];
  router: Router;
  token: String = "";
  message: String = "";
  mensagem: String = "";
  classMensagem: string = "";
  closeResult: String;
  service: AppGridViewService;
  pagerService: PagerService;
  @Input() loading: Boolean = false;
  isFilterCollapse: Boolean = false;
  user: Usuario = new Usuario();
  warning: String = "";
  motivoExclusao: string = '';
  pageLimit: number = 10;
  totalPages: Number;
  paging: any = {
    offset: 0,
    limit: 10,
    total: 0
  };

  enableSearchButton: any[] = [];
  dropdownList: any[] = [];


  @Input() errors: any[] = [];
  @Input() fields = [];
  @Input() fieldsSearch = [];
  @Input() method: String;
  @Input() domains: any[];
  @Input() object: any;
  @Input() exportXls: Boolean = false;
  @Input() showLabels: Boolean = true;
  @Input() customUrls : any[] = [];
  


  //ACTION BUTTONS

  @Input() create: Boolean = true;
  @Input() edit: Boolean = true;
  @Input() view: Boolean = true;
  @Input() remove: Boolean = true;
  @Input() refresh: Boolean = true;
  @Input() callbackLoadList: any;
  @Input() temMotivo: Boolean = false;
  @Input() urlForm: string;
  @Input() pagination: Boolean = false;
  @Input() autoLoad: Boolean = true;
  @Input() removeField: string = "id";

  @ViewChild('textoProcurado') textoProcurado: ElementRef;
  @Output() emitAlterXlsMethod = new EventEmitter();
  @Output() emitFilterMultiSelectMethod = new EventEmitter();

  actualPage: Number = 0;
  @Input() methodXls: String = this.method;
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
    pagerService: PagerService,
    service: AppGridViewService,
    private modalService: NgbModal,
    router: Router,
    private auth: AuthGuard,
    private previousRouteService: PreviousRouteService) {



    this.pagerService = pagerService;
    this.service = service;
    this.router = router;
    this.user = this.auth.getUser();
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

  atualizaMotivo(e: Event): void {
    this.motivoExclusao = (<HTMLInputElement>e.target).value;
  }

  remover(item: any) {

    this.loading = true;

    this.service.remove(item.id, this.method).subscribe(() => {

      this.mensagem = Translation.t("Registro removido com sucesso!");

      this.classMensagem = "alert-info";

      if (this.pagination) {
        this.getListPaged();
      } else {
        this.getList();
      }
    },
      (erro) => {
        setTimeout(() => this.loading = false, 300);
        this.errors = Util.customHTTPResponse(erro);
      }
    );
  }

  getList() {

    let params = "";
    this.errors = [];
    this.message = "";

    if (this.loading != true) {
      setTimeout(() => this.loading = true, 300);
    }


    if (this.object != null) {
      if (Object.keys(this.object).length) {
        for (let key of Object.keys(this.object)) {

          if (this.object[key] != "" && this.object[key] != 0 && this.object[key] != null) {
            if (typeof this.object[key] !== "undefined") {
              if (typeof this.object[key] == 'object') {

                if (isDate(this.object[key])) {
                  params += key + "=" + Util.dateFormat(this.object[key], "yyyy-MM-dd") + "&";
                } else {
                  let p: String = "";

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

    this.service.list(this.method + params).subscribe(result => {
      this.warning = "";
      this.allItems = result;

      if (Util.getPageState('route') == this.method) {
        this.setPage((Util.getPageState('page') ? parseInt(Util.getPageState('page')) : 0));
      }
      else {
        this.setPage(1);
      }

      this.savePageState();
      setTimeout(() => this.loading = false, 300);
    }, erro => {

      setTimeout(() => this.loading = false, 300);
      this.errors = Util.customHTTPResponse(erro);
    });
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
                  let p: String = "";

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
      this.paging.total = result['paging'].total;
      this.totalPages = Math.ceil((this.paging.total / this.paging.limit));
      this.allItems = result['objects'];

      setTimeout(() => {
        this.loading = false;
        this.savePageState();

      }, 300);
    }, erro => {
      setTimeout(() => this.loading = false, 300);
      this.errors = Util.customHTTPResponse(erro);
    });
  }

  open(content, item) {
    this.message = "";
    this.modalService.open(content).result.then((result) => {
      if (result) {
        this.remover(item);
        this.motivoExclusao = '';
      } else {
        this.motivoExclusao = '';
      }
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

      let uri: String = "";

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

  ngOnInit(): void {
    if (this.previousRouteService.getPreviousUrl()) {
      if (!this.previousRouteService.getPreviousUrl().startsWith(`/${this.method}-form`)) {
        Util.resetPageState();
      }
    } else {
      Util.resetPageState();
    }

    if (typeof Util.getPageState('textoProcurado') != 'undefined') {
      this.textoProcurado.nativeElement.value = Util.getPageState('textoProcurado');
    }
  }

  ngAfterViewInit() {
    if (this.domains) {
      this.checkDomains();
    } else {
      this.loadContent();
    }
  }

  refresher() {
    this.message = "";
    this.errors = [];
    this.getList();
  }

  refresherPagination() {
    this.errors = [];
    this.getListPaged(this.paging.offset, this.paging.limit);
  }

  toggleFilter() {
    this.isFilterCollapse = !this.isFilterCollapse;
  }

  loadDomain(route: String, event, object: any) {
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
    if (this.pagination) {
      this.getListPaged();
    } else {
      this.getList();

    }
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

  loadQuantityPerPage(event) {
    let id = parseInt(event.target.value);
    this.pageLimit = id;
    this.setPage(1);
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
    if (this.autoLoad) {
      if (!this.pagination) {
        this.getList();
      } else {
        this.getListPaged();
      }

    }

    if (Util.getPageState('route') == this.method) {

      if (Util.getPageState('domains') !== 'undefined') {
        this.domains = JSON.parse(Util.getPageState('domains'));
      }

      this.object = JSON.parse(Util.getPageState('object'));

      if (this.loading == true) {
        this.loading = false;
      }

      if (this.pagination) {
        this.setPagePagined(parseInt(Util.getPageState('page')), this.paging.limit);
      } else {
        this.getList();
      }

      this.emitAlterXlsMethod.emit(this.object);
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

  alterXlsMethod($event) {
    this.methodXls = $event.target.value;
    this.emitAlterXlsMethod.emit(this.object);
  }

  changeTextoProcurado() {
    this.savePageState();
  }

  filterMultiSelectMethod(field, value) {
    if (typeof field !== "undefined" && typeof value !== "undefined" && field !== null && value !== null) {
      this.emitFilterMultiSelectMethod.emit({ field: field, value: value });
    }
  }

  openCustomUrl(url : any, id : any, item : any) : void {

    let uri = url.url.replace("{id}", id);

    if(item.ano_receita)
      uri = uri.replace("{ano_receita}", item.ano_receita);

    if(item.numero_receita)
      uri = uri.replace("{numero_receita}", item.numero_receita);

    if(item.unidade_receita)
      uri = uri.replace("{unidade_receita}", item.unidade_receita);

    this.loading = true;

    this.service.file(url.log, uri).subscribe(result=>{
      this.loading = false;
      window.open(
        uri,
        url.self ? '_self' : '_blank'
      );
    });
  }
}
