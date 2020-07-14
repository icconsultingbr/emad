import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Paciente } from '../../../_core/_models/Paciente';
import { PagerService } from '../../../_core/_services';
import { Util } from '../../../_core/_util/Util';
import { Router } from '@angular/router';
import { EstoqueUnidadeService } from './estoque-unidade.service';
import { RelatorioEstoque } from '../../../_core/_models/RelatorioEstoque';
import { EstoqueUnidadeImpressaoService } from '../../../shared/services/estoque-unidade-impressao.service';

@Component({
  selector: 'app-estoque-unidade',
  templateUrl: './estoque-unidade.component.html',
  styleUrls: ['./estoque-unidade.component.css'],
  providers: [EstoqueUnidadeService]
})
export class EstoqueUnidadeComponent implements OnInit {

  //MESSAGES
  loading: Boolean = false;
  message: string = "";
  errors: any[] = [];
  modalRef: NgbModalRef = null;
  modalRemoveRef: NgbModalRef = null;
  form: FormGroup;

  //PAGINATION
  allItems: any[];
  pager: any = {};
  pagedItems: any[];
  pageLimit: number = 10;
  fields: any[] = [];
  agendas: any[] = [];

  //MODELS (OBJECTS)
  object: RelatorioEstoque = new RelatorioEstoque();
  estoquePorUnidade: any[] = [];
  listaEstoqueUnidadeDetalhe: any[] = [];
  pacienteSelecionado: any = null;
  domains: any[] = [];

  constructor(
    private pagerService: PagerService,
    private fb: FormBuilder,
    private service: EstoqueUnidadeService,
    private modalService: NgbModal,
    private estoqueUnidadeImpressaoService: EstoqueUnidadeImpressaoService, 
    private router: Router) {

    for (let field of this.service.fields) {
      if (field.grid) {
        this.fields.push(field);
      }
    }
  }

  ngOnInit() {
    this.carregaEstoquePorEstabelecimento(false);
  }

  carregaEstoquePorEstabelecimento(btn) {
    this.message = "";
    this.errors = [];
    this.loading = true;

    if(btn){
      if (!Util.isEmpty(this.object.nomeMaterial) && this.object.nomeMaterial.length<3)
      {
         this.errors = [{message:"Informe ao menos 3 caracteres da descrição do medicamento"}];
         this.loading = false;
         return;
      }
      
      if (!Util.isEmpty(this.object.nomeLote) && this.object.nomeLote.length<3)
      {
         this.errors = [{message:"Informe ao menos 3 caracteres da descrição do lote"}];
         this.loading = false;
         return;
      }  
    }

    var params = "?nomeMaterial=" + this.object.nomeMaterial + "&nomeLote=" + this.object.nomeLote;

    this.service.carregaEstoquePorEstabelecimento("pesquisa", this.object.idEstabelecimento, params).subscribe(result => {
      this.estoquePorUnidade = result;
      this.loading = false;
    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });
  }

  carregaEstoque(item: any){
    this.loading = true;
    this.listaEstoqueUnidadeDetalhe = [];
    this.estoquePorUnidade.forEach(itemEstoque => {      
      itemEstoque.expandir = (itemEstoque.id == item.id && itemEstoque.expandir == true) ? true : false;
    });
    item.expandir = !item.expandir;    
    this.service.carregaEstoquePorEstabelecimentoDetalhado(this.object.idEstabelecimento, item.idMaterial).subscribe(estoque => {
      this.listaEstoqueUnidadeDetalhe = estoque;                  
      this.loading = false;
    }, erro => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(erro);
    });
  }

  clear(){
    this.object.nomeMaterial = "";
    this.object.nomeLote = "";
    this.carregaEstoquePorEstabelecimento(false);
  }

  abreRelatorioEstoqueUnidade(idEstabelecimento: number, nomeMaterial: string, nomeLote: string, open: boolean) {    
    this.estoqueUnidadeImpressaoService.imprimir(idEstabelecimento, this.object.nomeEstabelecimento,  nomeMaterial, nomeLote, "");
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
}