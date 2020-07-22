import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { AjusteEstoqueService } from './ajuste-estoque.service';
import { Estoque } from '../../../_core/_models/Estoque';
import { TipoMovimento } from '../../../_core/_models/TipoMovimento';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ItemReceita } from '../../../_core/_models/ItemReceita';
import { Util } from '../../../_core/_util/Util';
import { Material } from '../../../_core/_models/Material';
import { MovimentoGeral, ItemMovimentoGeral } from '../../../_core/_models/MovimentoGeral';
import * as uuid from 'uuid';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EstoqueImpressaoService } from '../../../shared/services/estoque-impressao.service';
import * as _moment from 'moment';
const myId = uuid.v4();

@Component({
    selector: 'app-ajuste-estoque-form',
    templateUrl: './ajuste-estoque-form.component.html',
    styleUrls: ['./ajuste-estoque-form.component.css'],
    providers: [AjusteEstoqueService]
})

export class AjusteEstoqueFormComponent implements OnInit {
  @ViewChild('contentRecibo') contentRecibo: ElementRef;
  
  method: String = "estoque";
  fields: any[] = [];
  label: String = "Ajuste de estoque";
  movimento: MovimentoGeral = new MovimentoGeral();
  itemMovimento: ItemMovimentoGeral = new ItemMovimentoGeral();  
  id: Number = null;
  domains: any[] = [];
  form: FormGroup;
  loading: Boolean = false;
  message: string = '';
  errors: any[] = [];    
  listaMaterialLote: any[] = [];
  objectMaterial: Material = new Material();
  warning: string = '';
  modalRef: NgbModalRef = null; 
  tipoMovimento: TipoMovimento = new TipoMovimento();

  constructor(    
    private fb: FormBuilder,
    private service: AjusteEstoqueService,
    private ref: ChangeDetectorRef,
    private modalService: NgbModal,  
    private estoqueImpressaoService: EstoqueImpressaoService,
    private route: ActivatedRoute) {
      
    }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });

    this.loadDomains();
    this.createGroup();
  }

  loadDomains() {        
    this.service.list('tipo-movimento/administrativo').subscribe(tipoMovimento => {
      this.domains.push({            
        idTipoMovimento: tipoMovimento,                      
      }); 
    });     
  }

  createGroup() {
    this.form = this.fb.group({
      id: [''],
      idTipoMovimento: ['', ''],      
      motivo: ['', ''],      
      idFabricante: ['', ''],      
      idEstabelecimento: ['', ''],
      numeroEmpenho: ['', ''],
      validade: ['', ''],
      numeroDocumento: ['', ''],
      quantidade: ['', ''],
      idLoteAtual: ['', ''],
      lote: ['', '']
    });
  }

  toggleItemEntradaMaterial(){
    return Util.isEmpty(this.itemMovimento.idMaterial) 
    || Util.isEmpty(this.itemMovimento.idFabricante)
    || Util.isEmpty(this.itemMovimento.lote)
    || Util.isEmpty(this.itemMovimento.quantidade)
    || Util.isEmpty(this.itemMovimento.validade);    
  }

  medicamentoSelecionado(material: any){
    this.itemMovimento.idMaterial = material.id;
    this.itemMovimento.nomeMaterial = material.descricao;        
    this.buscaLotes();
  } 

  tipoMovimentoSelecionado(tipoMovimento: any){
    this.movimento.idTipoMovimento = tipoMovimento.target.value;
    this.tipoMovimento = this.domains[0].idTipoMovimento[tipoMovimento.target.options.selectedIndex-1];    
  } 

  fornecedorSelecionado(fornecedor: any){
    this.itemMovimento.idFabricante = fornecedor.target.value;
    this.itemMovimento.nomeFabricante = fornecedor.target.options[fornecedor.target.options.selectedIndex].text;    
  } 

  buscaLotes() {
    this.loading = true;
       this.service.list('estoque/material-lote/' 
       + this.itemMovimento.idMaterial
        + '/estabelecimento/' 
        +  JSON.parse(localStorage.getItem("est"))[0].id 
        + "?loteBloqueado="
        + "&loteVencido="
        + "&operacao=").subscribe(result => {
        this.domains[0].idLoteAtual = result;
        this.loading = false;
      }, error => {
        this.loading = false;
        this.errors = Util.customHTTPResponse(error);
      });
  }

  confirmaItemEntradaMaterial(){    
    if(this.movimentoContemDivergencias())
    return;

    this.itemMovimento.idFront = uuid.v4();
    
    //var date = _moment.utc(this.itemMovimento.validade, "YYYY-MM-DD");
    //this.itemMovimento.validade = new Date(date.format("YYYY-MM-DD")); 

    if (!this.movimento.itensMovimento)
      this.movimento.itensMovimento = [];

    let existeItemDispensa = false;

    this.movimento.itensMovimento.push(this.itemMovimento);
    this.itemMovimento = new ItemMovimentoGeral();
    this.listaMaterialLote = [];
    this.objectMaterial = new Material();
    this.ref.detectChanges();    
  }


  removeItemMovimento(item) {    
    this.movimento.itensMovimento = this.movimento.itensMovimento.filter(itemExistente => itemExistente.idFront != item.idFront);      
  }

  movimentoContemDivergencias()
  {
     this.errors = [];   
     var erroQtd = false;     
     let listaMaterialLoteExistente = [];     
     listaMaterialLoteExistente =  Object.assign([], this.movimento.itensMovimento);

     this.movimento.itensMovimento.forEach(item => {

     let materialExistente = listaMaterialLoteExistente.filter(itemAdicionado => itemAdicionado.idMaterial == this.itemMovimento.idMaterial
                                                                                && itemAdicionado.lote == this.itemMovimento.lote
                                                                                && itemAdicionado.idFabricante == this.itemMovimento.idFabricante);
     
     if(materialExistente.length > 0){
        this.errors.push({
          message: "Material já adicionado com o lote "+ this.itemMovimento.lote +"."
        });
        erroQtd = true;  
      }

     });

     return erroQtd;
  }

  sendForm(event, acao) {
    this.errors = [];    
    event.preventDefault();

    this.service
      .inserirMaterialEstoque(this.movimento, "entrada-material-estoque")
      .subscribe((res: any) => {
        this.movimento.id = res.id;
        this.movimento.dataMovimento = res.dataMovimento;
        this.openConfirmacao(this.contentRecibo);        
        this.warning = "";
      }, erro => {        
        this.errors = Util.customHTTPResponse(erro);
      });
  }

  twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
  }

  openConfirmacao(content: any) {
    this.modalRef = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: "lg"
    });
  }

  close() {
    if(this.modalRef)
      this.modalRef.close();  
    
    this.movimento = new MovimentoGeral();
    this.itemMovimento = new ItemMovimentoGeral();    
  }

  abreRelatorio() {    
    this.estoqueImpressaoService.imprimir("ENTRADA_MATERIAL", "Entrada de material", this.movimento.nomeEstabelecimento, this.movimento.id, this.movimento.numeroDocumento, this.movimento.dataMovimento);
    this.close();
  }
}