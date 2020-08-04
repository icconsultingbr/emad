import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { PedidoCompraService } from './pedido-compra.service';
import { PedidoCompra } from '../../../_core/_models/PedidoCompra';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemPedidoCompra } from '../../../_core/_models/ItemPedidoCompra';
import { Util } from '../../../_core/_util/Util';
import * as uuid from 'uuid';
import { Material } from '../../../_core/_models/Material';

@Component({
    selector: 'app-pedido-compra-form',
    templateUrl: './pedido-compra-form.component.html',
    styleUrls: ['./pedido-compra-form.component.css'],
    providers: [PedidoCompraService]
})

export class PedidoCompraFormComponent implements OnInit {
    
  fields: any[] = [];
  label: String = "pedido de compra";
  pedidoCompra: PedidoCompra = new PedidoCompra();
  itemPedidoCompra: ItemPedidoCompra = new ItemPedidoCompra();  
  id: Number = null;
  domains: any[] = [];
  form: FormGroup;
  loading: Boolean = false;
  message: string = '';
  errors: any[] = [];    
  listaMaterialLote: any[] = [];  
  warning: string = '';
  objectMaterial: Material = new Material();

  constructor(    
    private fb: FormBuilder,
    private service: PedidoCompraService,
    private ref: ChangeDetectorRef,    
    private route: ActivatedRoute,
    private router: Router) {
      
    }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      if(!Util.isEmpty(this.id))
        this.carregaPedidoCompra();
    });

    this.createGroup();
  }

  createGroup() {
    this.form = this.fb.group({
      id: [''], 
      numeroPedido: ['', ''],
      numeroEmpenho: ['', ''],
      dataPedido: ['', ''],
      dataEmpenho: ['', ''],
      dataPrevistaEntrega: ['', ''],
      qtdCompra: ['', '']      
    });
  }

  togglePedido(){
    return Util.isEmpty(this.pedidoCompra.numeroPedido)  
    || Util.isEmpty(this.pedidoCompra.dataPedido);
  }

  toggleItemEntradaMaterial(){
    return Util.isEmpty(this.itemPedidoCompra.idMaterial)     
    || Util.isEmpty(this.itemPedidoCompra.idPedidoCompra)
    || Util.isEmpty(this.itemPedidoCompra.qtdCompra)
    || Util.isEmpty(this.itemPedidoCompra.dataPrevistaEntrega);    
  }

  medicamentoSelecionado(material: any){
    this.itemPedidoCompra.idMaterial = material.id;
    this.itemPedidoCompra.nomeMaterial = material.descricao;    
  } 

  
  confirmaItemEntradaMaterial(){    
    if(this.movimentoContemDivergencias())
    return;

    this.itemPedidoCompra.idFront = uuid.v4();
    
    if (!this.pedidoCompra.itensPedidoCompra)
      this.pedidoCompra.itensPedidoCompra = [];

    let existeItemDispensa = false;

    this.pedidoCompra.itensPedidoCompra.push(this.itemPedidoCompra);
    this.itemPedidoCompra = new ItemPedidoCompra();
    this.listaMaterialLote = [];
    this.objectMaterial = new Material();
    this.ref.detectChanges();    
  }

  removeItemMovimento(item) {    
    this.pedidoCompra.itensPedidoCompra = this.pedidoCompra.itensPedidoCompra.filter(itemExistente => itemExistente.idFront != item.idFront);      
  }

  movimentoContemDivergencias()
  {
     this.errors = [];   
     var erroQtd = false;     
     let listaMaterialLoteExistente = [];     
     listaMaterialLoteExistente =  Object.assign([], this.pedidoCompra.itensPedidoCompra);

     this.pedidoCompra.itensPedidoCompra.forEach(item => {

     let materialExistente = listaMaterialLoteExistente.filter(itemAdicionado => itemAdicionado.idMaterial == this.itemPedidoCompra.idMaterial);
     
     if(materialExistente.length > 0){
        this.errors.push({
          message: "Material já adicionado."
        });
        erroQtd = true;  
       }
      });
     return erroQtd;
  }

  sendForm(event) {
    this.errors = [];    
    event.preventDefault();
    
    this.service
      .inserir(this.pedidoCompra)
      .subscribe((res: any) => {
        if (this.pedidoCompra.id){
          this.back();
        }          
        else{
          this.pedidoCompra.id = res.id;
          this.itemPedidoCompra = res.id;
          this.message = "Pedido " + res.id + " criado com sucesso!";
          this.warning = "";
        }        
      }, erro => {        
        this.errors = Util.customHTTPResponse(erro);
      });
  }

  carregaPedidoCompra() {
    this.pedidoCompra.id = this.id;
    this.errors = [];
    this.message = "";
    this.loading = true;
    this.service.findById(this.id, "pedido-compra").subscribe(result => {
      this.pedidoCompra = result;          
      this.pedidoCompra.dataPedido = this.pedidoCompra.dataPedido ? new Date(this.pedidoCompra.dataPedido) : null;
      this.pedidoCompra.dataEmpenho = this.pedidoCompra.dataEmpenho ?  new Date(this.pedidoCompra.dataEmpenho) : null;      
      this.loading = false;
    }, error => {
      this.pedidoCompra = new PedidoCompra();      
      this.errors.push({
        message: "Pedido de compra não encontrado"
      });
    });
  }

  back() {   
    const route = "pedidos-compras";
    this.router.navigate([route]);
  }
}