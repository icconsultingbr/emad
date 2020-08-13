import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Util } from '../../../_core/_util/Util';
import { ItemReceita } from '../../../_core/_models/ItemReceita';
import { Estoque } from '../../../_core/_models/Estoque';
import * as uuid from 'uuid';
import { ProfissionalMedicamentoImpressaoService } from '../../../shared/services/profissional-medicamento.service';
import { ProfissionalMedicamentoService } from './profissional-medicamento.service';
import { RelatorioMedicamento } from '../../../_core/_models/RelatorioMedicamento';
import { Material } from '../../../_core/_models/Material';

const myId = uuid.v4();

@Component({
    selector: 'app-profissional-medicamento-form',
    templateUrl: './profissional-medicamento.component.html',
    styleUrls: ['./profissional-medicamento.component.css'],
    providers: [ProfissionalMedicamentoService]
})

export class ProfissionalMedicamentoComponent implements OnInit {  
  object: RelatorioMedicamento = new RelatorioMedicamento();
  itemReceita: ItemReceita = new ItemReceita();  
  itemEstoque: Estoque = new Estoque();  
  method: string = "receitas";
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
    private service: ProfissionalMedicamentoService, 
    private ref: ChangeDetectorRef, 
    private medicamentoProfissionalService: ProfissionalMedicamentoImpressaoService) {
      this.fields = service.fields;
    }

  ngOnInit() {
    this.createGroup();
    this.loadDomains();   
    this.object.ordenadoPor="nomeProfissional";
  }

  loadDomains() {       
    this.service.listDomains('estabelecimento').subscribe(estabelecimentos => {
      this.service.listDomains('fabricante-material').subscribe(fabricante => {
        this.domains.push({            
          idEstabelecimento: estabelecimentos,
          idFabricanteMaterial: fabricante,
          ordenadoPor: [
            { id: "crmProfissional", nome: "Inscrição" },
            { id: "nomeProfissional", nome: "Nome" },
            { id: "espec.nome", nome: "Especialidade profissional" },
            { id: "qtdPrescrita", nome: "Quantidade prescrita" },
            { id: "qtdDispensada", nome: "Quantidade dispensada" },            
            { id: "nomeFantasia", nome: "Estabelecimento" },    
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
    this.object.criteriosPesquisa.nomePaciente = this.object.nomePaciente;
    this.object.criteriosPesquisa.nomeMaterial = this.object.nomeMaterial;
    this.object.criteriosPesquisa.nomeEstabelecimento = this.object.nomeEstabelecimento;
    this.object.criteriosPesquisa.nomeFabricanteMaterial = this.object.nomeFabricanteMaterial;
    this.object.criteriosPesquisa.lote = this.object.lote;
    
    var dataInicialFiltro =  this.object.dataInicial.getFullYear() + "-" + this.twoDigits(1 + this.object.dataInicial.getMonth()) + "-" + this.twoDigits(this.object.dataInicial.getDate());
    var dataFinalFiltro =  this.object.dataFinal.getFullYear() + "-" + this.twoDigits(1 + this.object.dataFinal.getMonth()) + "-" + this.twoDigits(this.object.dataFinal.getDate());

    this.object.params = "?dataInicial=" + dataInicialFiltro
                       + "&dataFinal=" + dataFinalFiltro
                       + "&idMaterial=" + (this.object.idMaterial ? this.object.idMaterial : '')
                       + "&idEstabelecimento=" + (this.object.idEstabelecimento  ? this.object.idEstabelecimento : '')
                       + "&idFabricante=" + (this.object.idFabricanteMaterial  ? this.object.idFabricanteMaterial : '')
                       + "&lote=" + (this.object.lote  ? this.object.lote : '')
                       + "&ordenadoPor=" + (this.object.ordenadoPor  ? this.object.ordenadoPor : '');

    this.medicamentoProfissionalService.imprimir(this.object, JSON.parse(localStorage.getItem("est"))[0].nomeFantasia, this.object.criteriosPesquisa);    
  }

  exportarCsv(){
    this.errors = [];

    this.object.criteriosPesquisa = {};
    this.object.criteriosPesquisa.dataInicial = this.object.dataInicial;
    this.object.criteriosPesquisa.dataFinal = this.object.dataFinal;
    this.object.criteriosPesquisa.nomePaciente = this.object.nomePaciente;
    this.object.criteriosPesquisa.nomeMaterial = this.object.nomeMaterial;
    this.object.criteriosPesquisa.nomeEstabelecimento = this.object.nomeEstabelecimento;
    this.object.criteriosPesquisa.nomeFabricanteMaterial = this.object.nomeFabricanteMaterial;
    this.object.criteriosPesquisa.lote = this.object.lote;
    
    var dataInicialFiltro =  this.object.dataInicial.getFullYear() + "-" + this.twoDigits(1 + this.object.dataInicial.getMonth()) + "-" + this.twoDigits(this.object.dataInicial.getDate());
    var dataFinalFiltro =  this.object.dataFinal.getFullYear() + "-" + this.twoDigits(1 + this.object.dataFinal.getMonth()) + "-" + this.twoDigits(this.object.dataFinal.getDate());

    this.object.params = "?dataInicial=" + dataInicialFiltro
                       + "&dataFinal=" + dataFinalFiltro
                       + "&idMaterial=" + (this.object.idMaterial ? this.object.idMaterial : '')
                       + "&idEstabelecimento=" + (this.object.idEstabelecimento  ? this.object.idEstabelecimento : '')
                       + "&idFabricante=" + (this.object.idFabricanteMaterial  ? this.object.idFabricanteMaterial : '')
                       + "&lote=" + (this.object.lote  ? this.object.lote : '')
                       + "&ordenadoPor=" + (this.object.ordenadoPor  ? this.object.ordenadoPor : '');


    this.medicamentoProfissionalService.exportar(this.object, JSON.parse(localStorage.getItem("est"))[0].nomeFantasia, this.object.criteriosPesquisa); 
  }

  clear(){
    this.object = new RelatorioMedicamento();
    this.objectMaterial = new Material();
    this.ref.detectChanges();
    this.object.ordenadoPor="nomeProfissional";
  }

  medicamentoSelecionado(material: any){
    this.object.idMaterial = material.id;
    this.object.nomeMaterial = material.descricao;
  }

  pacienteSelecionado(object: any){
    this.object.idPaciente = object.id;
    this.object.nomePaciente = object.nome;
  }

  estabelecimentoSelecionado(estabelecimento: any){            
    this.object.nomeEstabelecimento = this.domains[0].idEstabelecimento[estabelecimento.target.options.selectedIndex-1].nome;
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
      idEstabelecimento: ['', ''],      
      ordenadoPor: ['', Validators.required],
      dataInicial: ['', Validators.required],
      dataFinal: ['', Validators.required],
      lote: ['',''],
      idFabricanteMaterial: ['',''],
    });
  }
}