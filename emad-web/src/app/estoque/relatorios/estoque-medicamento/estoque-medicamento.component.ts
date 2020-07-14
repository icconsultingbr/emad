import { Component, OnInit, ViewChild, ElementRef, Input, ChangeDetectorRef } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PagerService } from '../../../_core/_services';
import { Util } from '../../../_core/_util/Util';
import { Router } from '@angular/router';
import { EstoqueMedicamentoService } from './estoque-medicamento.service';
import { RelatorioEstoque } from '../../../_core/_models/RelatorioEstoque';
import { EstoqueMedicamentoImpressaoService } from '../../../shared/services/estoque-medicamento-impressao.service';
import { Material } from '../../../_core/_models/Material';

@Component({
  selector: 'app-estoque-medicamento',
  templateUrl: './estoque-medicamento.component.html',
  styleUrls: ['./estoque-medicamento.component.css'],
  providers: [EstoqueMedicamentoService]
})
export class EstoqueMedicamentoComponent implements OnInit {

  //MESSAGES
  loading: Boolean = false;
  message: string = "";
  errors: any[] = [];
  modalRef: NgbModalRef = null;
  modalRemoveRef: NgbModalRef = null;
  form: FormGroup;
  method: string = "agenda";

  //PAGINATION
  allItems: any[];
  pager: any = {};
  pagedItems: any[];
  pageLimit: number = 10;
  fields: any[] = [];

  //MODELS (OBJECTS)
  object: RelatorioEstoque = new RelatorioEstoque();
  estoquePorUnidade: any[] = [];
  listaEstoqueUnidadeDetalhe: any[] = [];  
  domains: any[] = [];
  objectMaterial: Material = new Material();
  
  constructor(
    private pagerService: PagerService,
    private fb: FormBuilder,
    private service: EstoqueMedicamentoService,
    private estoqueMedicamentoImpressaoService: EstoqueMedicamentoImpressaoService,     
    private ref: ChangeDetectorRef) {

    for (let field of this.service.fields) {
      if (field.grid) {
        this.fields.push(field);
      }
    }
  }

  medicamentoSelecionado(material: any){
    this.object.idMaterial = material.id;
    this.object.nomeMaterial = material.descricao;
    this.carregaEstoquePorMedicamento();
  } 

  ngOnInit() {

  }

  carregaEstoquePorMedicamento() {
    this.message = "";
    this.errors = [];
    this.loading = true;

    this.service.carregaEstoquePorMedicamento("pesquisa", this.object.idMaterial).subscribe(result => {
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
      itemEstoque.expandir = (itemEstoque.idEstabelecimento == item.idEstabelecimento && itemEstoque.expandir == true) ? true : false;
    });
    item.expandir = !item.expandir;    
    this.service.carregaEstoquePorEstabelecimentoDetalhado(item.idEstabelecimento, item.idMaterial).subscribe(estoque => {
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
    this.estoquePorUnidade = [];
    this.objectMaterial = new Material();
    this.ref.detectChanges();
  }

  abreRelatorioEstoqueMedicamento(idMaterial: number, open: boolean) {    
    this.estoqueMedicamentoImpressaoService.imprimir(idMaterial, "");
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