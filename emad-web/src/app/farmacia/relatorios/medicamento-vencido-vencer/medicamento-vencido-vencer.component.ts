import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Util } from '../../../_core/_util/Util';
import { ItemReceita } from '../../../_core/_models/ItemReceita';
import { Estoque } from '../../../_core/_models/Estoque';
import * as uuid from 'uuid';
import { MedicamentoVencidoVencerImpressaoService } from '../../../shared/services/medicamento-vencido-vencer.service';
import { MedicamentoVencidoVencerService } from './medicamento-vencido-vencer.service';
import { RelatorioMedicamento } from '../../../_core/_models/RelatorioMedicamento';
import { Material } from '../../../_core/_models/Material';

const myId = uuid.v4();

@Component({
    selector: 'app-medicamento-vencido-vencer-form',
    templateUrl: './medicamento-vencido-vencer.component.html',
    styleUrls: ['./medicamento-vencido-vencer.component.css'],
    providers: [MedicamentoVencidoVencerService]
})

export class MedicamentoVencidoVencerComponent implements OnInit {  
  object: RelatorioMedicamento = new RelatorioMedicamento();
  itemReceita: ItemReceita = new ItemReceita();  
  itemEstoque: Estoque = new Estoque();    
  fields: any[] = [];
  label: string = "";
  id: number = null;
  domains: any[] = [];  
  loading: Boolean = false;
  form: FormGroup;
  groupForm: any = {};
  type: string;
  message: string = '';
  warning: string = '';     
  errors: any[] = [];  
  objectMaterial: Material = new Material();
  
  constructor(
    private fb: FormBuilder,
    private service: MedicamentoVencidoVencerService, 
    private ref: ChangeDetectorRef, 
    private medicamentoVencidoVencerService: MedicamentoVencidoVencerImpressaoService) {
      this.fields = service.fields;
    }

  ngOnInit() {
    this.createGroup();
    this.loadDomains();  
    this.object.ordenadoPor = "mat.codigo";
    this.object.idEstabelecimento = JSON.parse(localStorage.getItem("est"))[0].id;
    this.object.nomeEstabelecimento = JSON.parse(localStorage.getItem("est"))[0].nomeFantasia;
  }

  loadDomains() {       
    this.service.listDomains('estabelecimento').subscribe(estabelecimentos => {
      this.service.listDomains('fabricante-material').subscribe(fabricantes => {
        this.domains.push({            
          idEstabelecimento: estabelecimentos,
          idFabricanteMaterial: fabricantes,
          ordenadoPor: [
            { id: "mat.codigo", nome: "Código" },
            { id: "est.validade", nome: "Data de validade" },
            { id: "fab.nome", nome: "Fabricante" },
            { id: "est.lote", nome: "Lote" },          
            { id: "mat.descricao", nome: "Medicamento" },                               
          ],
        });                           
      });                           
    });                           
  }      
  
  visualizarPdf() {        
    this.errors = [];

    this.object.criteriosPesquisa = {};
    this.object.criteriosPesquisa.dataInicial = this.object.dataInicial;
    this.object.criteriosPesquisa.dataFinal = this.object.dataFinal;
    this.object.criteriosPesquisa.nomeProfissional = this.object.nomeProfissional;
    this.object.criteriosPesquisa.nomeMaterial = this.object.nomeMaterial;
    this.object.criteriosPesquisa.nomeEstabelecimento = this.object.nomeEstabelecimento;
    this.object.criteriosPesquisa.nomeFabricanteMaterial = this.object.nomeFabricanteMaterial;

    var dataInicialFiltro =  this.object.dataInicial.getFullYear() + "-" + this.twoDigits(1 + this.object.dataInicial.getMonth()) + "-" + this.twoDigits(this.object.dataInicial.getDate());
    var dataFinalFiltro =  this.object.dataFinal.getFullYear() + "-" + this.twoDigits(1 + this.object.dataFinal.getMonth()) + "-" + this.twoDigits(this.object.dataFinal.getDate());

    this.object.params = "?dataInicial=" + dataInicialFiltro
                       + "&dataFinal=" + dataFinalFiltro
                       + "&idMaterial=" + (this.object.idMaterial ? this.object.idMaterial : '')
                       + "&idFabricante=" + (this.object.idFabricanteMaterial  ? this.object.idFabricanteMaterial : '')
                       + "&idEstabelecimento=" + (this.object.idEstabelecimento  ? this.object.idEstabelecimento : '')
                       + "&ordenadoPor=" + (this.object.ordenadoPor  ? this.object.ordenadoPor : '');

    this.medicamentoVencidoVencerService.imprimir(this.object, JSON.parse(localStorage.getItem("est"))[0].nomeFantasia, this.object.criteriosPesquisa);    
  }

  exportarCsv(){
    this.errors = [];

    this.object.criteriosPesquisa = {};
    this.object.criteriosPesquisa.dataInicial = this.object.dataInicial;
    this.object.criteriosPesquisa.dataFinal = this.object.dataFinal;
    this.object.criteriosPesquisa.nomeProfissional = this.object.nomeProfissional;
    this.object.criteriosPesquisa.nomeMaterial = this.object.nomeMaterial;
    this.object.criteriosPesquisa.nomeEstabelecimento = this.object.nomeEstabelecimento;
    this.object.criteriosPesquisa.nomeFabricanteMaterial = this.object.nomeFabricanteMaterial;

    var dataInicialFiltro =  this.object.dataInicial.getFullYear() + "-" + this.twoDigits(1 + this.object.dataInicial.getMonth()) + "-" + this.twoDigits(this.object.dataInicial.getDate());
    var dataFinalFiltro =  this.object.dataFinal.getFullYear() + "-" + this.twoDigits(1 + this.object.dataFinal.getMonth()) + "-" + this.twoDigits(this.object.dataFinal.getDate());

    this.object.params = "?dataInicial=" + dataInicialFiltro
                       + "&dataFinal=" + dataFinalFiltro
                       + "&idMaterial=" + (this.object.idMaterial ? this.object.idMaterial : '')
                       + "&idFabricante=" + (this.object.idFabricanteMaterial  ? this.object.idFabricanteMaterial : '')
                       + "&idEstabelecimento=" + (this.object.idEstabelecimento  ? this.object.idEstabelecimento : '')
                       + "&ordenadoPor=" + (this.object.ordenadoPor  ? this.object.ordenadoPor : '');


    this.medicamentoVencidoVencerService.exportar(this.object, JSON.parse(localStorage.getItem("est"))[0].nomeFantasia, this.object.criteriosPesquisa); 
  }

  clear(){
    this.object = new RelatorioMedicamento();
    this.objectMaterial = new Material();
    this.ref.detectChanges();
    this.object.ordenadoPor = "mat.codigo";
    this.object.idEstabelecimento = JSON.parse(localStorage.getItem("est"))[0].id;
    this.object.nomeEstabelecimento = JSON.parse(localStorage.getItem("est"))[0].nomeFantasia;
  }

  medicamentoSelecionado(material: any){
    this.object.idMaterial = material.id;
    this.object.nomeMaterial = material.descricao;
  }

  estabelecimentoSelecionado(idEstabelecimento: any){            
    this.object.nomeEstabelecimento = this.domains[0].idEstabelecimento[idEstabelecimento.target.options.selectedIndex-1].nome;
  }
  
  fabricanteSelecionado(fabricante: any){            
    this.object.nomeFabricanteMaterial = this.domains[0].idFabricanteMaterial[fabricante.target.options.selectedIndex-1].nome;
  } 

  twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
  }
  
  createGroup() {
    this.form = this.fb.group({      
      idEstabelecimento: new FormControl({value: '', disabled: true}, Validators.required),      
      idFabricanteMaterial: ['', ''],      
      ordenadoPor: ['', Validators.required],
      dataInicial: ['', Validators.required],
      dataFinal: ['', Validators.required],
    });
  }
}