import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';
import { Atendimento } from '../../../_core/_models/Atendimento';
import { AppNavbarService } from '../../../_core/_components/app-navbar/app-navbar.service';
import { AtendimentoService } from '.././atendimento.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { PagerService } from '../../../_core/_services';
import { Usuario } from '../../../_core/_models/Usuario';
import { Util } from '../../../_core/_util/Util';
import { Translation } from '../../../_core/_locale/Translation';
import { isDate } from 'util';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-atendimento-sala-espera',
  templateUrl: './atendimento-sala-espera.component.html',
  styleUrls: ['./atendimento-sala-espera.component.css'],
  providers: [AtendimentoService]
})
export class AtendimentoSalaEsperaComponent implements OnInit {

  allItems: any[];
  pager: any = {};
  pagedItems: any[];

  message = '';
  mensagem = '';
  mensagemModal = '';
  isFilterCollapse = false;
  pagerService: PagerService;
  warning = '';
  pageLimit = 10;
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
  loading = false;

  sortColumn = 'id';
  sortOrder = 'desc';

  //ACTION BUTTONS
  @Input() create: Boolean = true;
  @Input() view: Boolean = true;
  @Input() urlForm = 'atendimentos/sala-espera-criar';

  @ViewChild('textoProcurado') textoProcurado: ElementRef;
  @Output() emitFilterMultiSelectMethod = new EventEmitter();
  @ViewChild('content') content: ElementRef;

  method = 'atendimento';
  domains: any[] = [];
  fields = [];
  fieldsSearch = [];
  object: Atendimento = new Atendimento();
  idPaciente: 0;
  virtualDirectory: string = environment.virtualDirectory != '' ? environment.virtualDirectory + '/' : '';

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

    for (const field of this.service.fields) {
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

    if (this.idPaciente > 0) {
      this.object.idPaciente = this.idPaciente;
    }
  }

  loadDomains() {
    this.service.listDomains('estabelecimento').subscribe(estabelecimentos => {
      this.domains.push({
        s: estabelecimentos,
        situacao: [
          { id: '0', nome: 'Sala de espera' }
        ]
      });
    });
  }

  setPagePagined(offset: number, limit: Number) {
    this.paging.offset = offset !== undefined ? offset : 0;
    this.paging.limit = limit ? limit : this.paging.limit;
    this.getListPaged(this.paging.offset, this.paging.limit);
  }

  getListPaged(offset: Number = null, limit: Number = null) {

    this.message = '';
    this.paging.offset = offset ? offset : 0;
    this.paging.limit = limit ? limit : 10;

    if (this.loading != true) {
     setTimeout(() => this.loading = true, 300);
    }

    let params = '';
    this.errors = [];

    if (this.object !== null) {
      if (Object.keys(this.object).length) {
        for (const key of Object.keys(this.object)) {
          if (this.object[key] != '' && this.object[key] != 0 && this.object[key] != null) {
            if (typeof this.object[key] !== 'undefined') {
              if (typeof this.object[key] == 'object') {
                if (isDate(this.object[key])) {
                  params += key + '=' + Util.dateFormat(this.object[key], 'yyyy-MM-dd') + '&';
                } else {
                  let p = '';

                  for (const k of this.object[key]) {
                    p += k.id + ',';
                  }
                  params += key + '=' + p.substring(0, p.length - 1) + '&';
                }
              } else {
                if (this.object[key].toString().indexOf('/') >= 0) {
                  params += key + '=' + Util.dateFormat(this.object[key], 'yyyy-MM-dd') + '&';
                } else {
                  params += key + '=' + this.object[key] + '&';
                }
              }
            }
          }
        }

        if (params != '') {
          params = '?' + params;
        }
      }
    }

    if (this.paging.offset != null && this.paging.limit != null) {
      params += (params == '' ? '?' : '') + 'offset=' + this.paging.offset + '&limit=' + this.paging.limit;
    }

    params += (params == '' ? '?' : '&') + 'situacao=0';

    if (this.sortColumn) {
      params += (params == '' ? '?' : '&') +  `sortColumn=${this.sortColumn}&sortOrder=${this.sortOrder}`;
    }

    this.service.list(this.method + params).subscribe(result => {
      this.warning = '';
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

  pesquisaCentral() {
    this.object.pesquisaCentral = this.textoProcurado.nativeElement.value;
    this.getListPaged();
  }

  new() {
    if (this.urlForm != undefined) {
      this.router.navigate(['/' + this.urlForm]);
    } else {
      const route = this.method.split('/');
      this.router.navigate(['/' + route[0] + '-form']);
    }
  }

  viewer(id) {
    this.message = '';
    if (this.urlForm != undefined) {
      this.router.navigate(['/' + this.urlForm + '/' + id]);
    } else {
      const route = this.method.split('/');
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
    this.mensagem = '';
    this.getListPaged();
  }

  clear() {
    if (this.object != null) {

      if (Object.keys(this.object).length) {
        for (const key of Object.keys(this.object)) {

          if (this.object[key] != '' && this.object[key] != 0) {

            const fields2 = this.fieldsSearch.filter(item => item.field == key);

            if (typeof fields2[0] != 'undefined' && fields2[0] !== null) {
              if (fields2[0].filter.type == 'select') {
                if (fields2[0].filter.changeTarget) {
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
      Util.savePageState(null, 0, null, null, '');
      this.allItems = [];
      this.textoProcurado.nativeElement.value = '';
    }

  }

  loadQuantityPerPagePagination(event) {
    const id = parseInt(event.target.value);
    this.paging.limit = id;

    this.setPagePagined(this.pager.offset, this.paging.limit);
  }

  translate(term, obj) {
    if (typeof (obj) == 'object') {
      return obj[term];
    } else {
      return Translation.t(term);
    }
  }

  haveSubmitPermission() {
    return true;
  }

  toCurrency(number, mask) {
    if (number == null) {
      return '';
    }

    if (typeof (mask) == 'object') {
      return Util.convertToCurrency(number);
    } else {
      return number.replace('R$ ', '').replace('.', ',');
    }
  }

  abreFichaDownload(item) {
    let uri = JSON.parse(localStorage.getItem('parametro_seguranca')).filter((url) => url.nome == 'URL_FICHA_MEDICA_IMPRESSAO')
              ?
              JSON.parse(localStorage.getItem('parametro_seguranca')).filter((url) => url.nome == 'URL_FICHA_MEDICA_IMPRESSAO')[0].valor
              : '';

    uri = uri.replace('{id}', item.id);

    this.loading = true;
    this.service.enviaFicha(item).subscribe(result => {
      this.service.file('atendimento/print-document', uri).subscribe(result => {
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
    let uri = JSON.parse(localStorage.getItem('parametro_seguranca')).filter((url) => url.nome == 'URL_FICHA_MEDICA_VISUALIZACAO')
              ?
              JSON.parse(localStorage.getItem('parametro_seguranca')).filter((url) => url.nome == 'URL_FICHA_MEDICA_VISUALIZACAO')[0].valor
              : '';

    uri = uri.replace('{id}', item.id);

    this.loading = true;

    this.service.file('atendimento/open-document', uri).subscribe(result => {
      this.loading = false;
      window.open(
        uri,
        '_blank'
      );
    });
    this.loading = false;
  }

  abreReceitaMedica(item) {
    if (!item.numero_receita || item.numero_receita == 0) {
      this.openConfirmacao(this.content);
      this.mensagemModal = 'Receita não encontrada';
      return;
    }

    let uri = this.router.url.replace('atendimentos', '') + this.virtualDirectory + '#/atendimentos/relatorio-receita/{ano_receita}/{unidade_receita}/{numero_receita}/false';

    if (item.ano_receita) {
      uri = uri.replace('{ano_receita}', item.ano_receita);
    }

    if (item.numero_receita) {
      uri = uri.replace('{numero_receita}', item.numero_receita);
    }

    if (item.unidade_receita) {
      uri = uri.replace('{unidade_receita}', item.unidade_receita);
    }

    this.loading = true;

    this.service.file('atendimento/receita-medica', uri).subscribe(result => {
      this.loading = false;
      window.open(
        uri,
        '_blank'
      );
    });
    this.loading = false;
  }

  close() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  openConfirmacao(content: any) {
    this.modalRef = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'sm'
    });
  }

  sort(field: string): void {
    if (this.sortColumn === field) {
      this.toggleSort();
    }

    this.sortColumn = field;

    this.getListPaged(this.paging.offset, this.paging.limit);
  }

  toggleSort(): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
  }
}
