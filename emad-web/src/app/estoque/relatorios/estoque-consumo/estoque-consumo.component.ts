import { Component, OnInit, ViewChild, ElementRef, Input, ChangeDetectorRef } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PagerService } from '../../../_core/_services';
import { Util } from '../../../_core/_util/Util';
import { Router } from '@angular/router';
import { EstoqueConsumoService } from './estoque-consumo.service';
import { RelatorioEstoque } from '../../../_core/_models/RelatorioEstoque';
import { EstoqueConsumoImpressaoService } from '../../../shared/services/estoque-consumo-impressao.service';
import { Material } from '../../../_core/_models/Material';

@Component({
  selector: 'app-estoque-consumo',
  templateUrl: './estoque-consumo.component.html',
  styleUrls: ['./estoque-consumo.component.css'],
  providers: [EstoqueConsumoService]
})
export class EstoqueConsumoComponent implements OnInit {

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
    private service: EstoqueConsumoService,
    private estoqueConsumoImpressaoService: EstoqueConsumoImpressaoService,     
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
  } 

  ngOnInit() {
    this.loadDomains();
  }

  clear(){    
    this.object.nomeMaterial = "";
    this.object.nomeLote = "";
    this.estoquePorUnidade = [];
    this.objectMaterial = new Material();
    this.object = new RelatorioEstoque();
    this.ref.detectChanges();
  }

  abreRelatorioEstoqueConsumo(idMaterial: number,  idEstabelecimento: number, estoqueAbaixoMinimo: string, nomeEstabelecimento: string, nomeMaterial: string) {    
    this.estoqueConsumoImpressaoService.imprimir(idMaterial, idEstabelecimento, estoqueAbaixoMinimo, nomeEstabelecimento, nomeMaterial);
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

  loadDomains() {
    this.domains.push({
      estoqueAbaixoMinimo: [
        { id: "N", nome: "Não" },
        { id: "S", nome: "Sim" },
      ]
    });            
  }
}