import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Util } from '../../../_core/_util/Util';
import { ItemReceita } from '../../../_core/_models/ItemReceita';
import { Estoque } from '../../../_core/_models/Estoque';
import * as uuid from 'uuid';
import { MedicamentoLivroControladoImpressaoService } from '../../../shared/services/medicamento-livro-controlado.service';
import { MedicamentoLivroControladoService } from './medicamento-livro-controlado.service';
import { RelatorioMedicamento } from '../../../_core/_models/RelatorioMedicamento';
import { Material } from '../../../_core/_models/Material';

const myId = uuid.v4();

@Component({
    selector: 'app-medicamento-livro-controlado-form',
    templateUrl: './medicamento-livro-controlado.component.html',
    styleUrls: ['./medicamento-livro-controlado.component.css'],
    providers: [MedicamentoLivroControladoService]
})

export class MedicamentoLivroControladoComponent implements OnInit {  
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
    private service: MedicamentoLivroControladoService, 
    private ref: ChangeDetectorRef, 
    private medicamentoLivroControladoService: MedicamentoLivroControladoImpressaoService) {
      this.fields = service.fields;
    }

  ngOnInit() {
    this.createGroup();
    this.loadDomains();   
    this.object.idEstabelecimento = JSON.parse(localStorage.getItem("est"))[0].id;
    this.object.nomeEstabelecimento = JSON.parse(localStorage.getItem("est"))[0].nomeFantasia;
  }

  loadDomains() {       
    this.service.listDomains('estabelecimento').subscribe(estabelecimentos => {
      this.service.list('livro').subscribe(livros => {
        this.domains.push({            
          idEstabelecimento: estabelecimentos,
          idLivro: livros
        });                           
      });                           
    });                           
  }      
  
  visualizarPdf() {        
    this.errors = [];

    this.object.criteriosPesquisa = {};
    this.object.criteriosPesquisa.dataInicial = this.object.dataInicial;
    this.object.criteriosPesquisa.dataFinal = this.object.dataFinal;
    this.object.criteriosPesquisa.nomeTipoMovimento = this.object.nomeTipoMovimento;
    this.object.criteriosPesquisa.nomeMaterial = this.object.nomeMaterial;
    this.object.criteriosPesquisa.nomeEstabelecimento = this.object.nomeEstabelecimento;

    var dataInicialFiltro =  this.object.dataInicial.getFullYear() + "-" + this.twoDigits(1 + this.object.dataInicial.getMonth()) + "-" + this.twoDigits(this.object.dataInicial.getDate());
    var dataFinalFiltro =  this.object.dataFinal.getFullYear() + "-" + this.twoDigits(1 + this.object.dataFinal.getMonth()) + "-" + this.twoDigits(this.object.dataFinal.getDate());

    this.object.params = "?dataInicial=" + dataInicialFiltro
                       + "&dataFinal=" + dataFinalFiltro
                       + "&idMaterial=" + (this.object.idMaterial ? this.object.idMaterial : '')
                       + "&idTipoMovimento=" + (this.object.idTipoMovimento ? this.object.idTipoMovimento : '')
                       + "&idEstabelecimento=" + (this.object.idEstabelecimento  ? this.object.idEstabelecimento : '')
                       + "&ordenadoPor=" + (this.object.ordenadoPor  ? this.object.ordenadoPor : '');

    this.medicamentoLivroControladoService.imprimir(this.object, JSON.parse(localStorage.getItem("est"))[0].nomeFantasia, this.object.criteriosPesquisa);    
  }

  exportarCsv(){
    this.errors = [];

    this.object.criteriosPesquisa = {};
    this.object.criteriosPesquisa.dataInicial = this.object.dataInicial;
    this.object.criteriosPesquisa.dataFinal = this.object.dataFinal;
    this.object.criteriosPesquisa.nomeTipoMovimento = this.object.nomeTipoMovimento;
    this.object.criteriosPesquisa.nomeMaterial = this.object.nomeMaterial;
    this.object.criteriosPesquisa.nomeEstabelecimento = this.object.nomeEstabelecimento;

    var dataInicialFiltro =  this.object.dataInicial.getFullYear() + "-" + this.twoDigits(1 + this.object.dataInicial.getMonth()) + "-" + this.twoDigits(this.object.dataInicial.getDate());
    var dataFinalFiltro =  this.object.dataFinal.getFullYear() + "-" + this.twoDigits(1 + this.object.dataFinal.getMonth()) + "-" + this.twoDigits(this.object.dataFinal.getDate());

    this.object.params = "?dataInicial=" + dataInicialFiltro
                       + "&dataFinal=" + dataFinalFiltro
                       + "&idMaterial=" + (this.object.idMaterial ? this.object.idMaterial : '')
                       + "&idTipoMovimento=" + (this.object.idTipoMovimento ? this.object.idTipoMovimento : '')
                       + "&idEstabelecimento=" + (this.object.idEstabelecimento  ? this.object.idEstabelecimento : '')
                       + "&ordenadoPor=" + (this.object.ordenadoPor  ? this.object.ordenadoPor : '');

    this.medicamentoLivroControladoService.exportar(this.object, JSON.parse(localStorage.getItem("est"))[0].nomeFantasia, this.object.criteriosPesquisa); 
  }

  clear(){
    this.object = new RelatorioMedicamento();
    this.objectMaterial = new Material();
    this.ref.detectChanges();
    this.object.idEstabelecimento = JSON.parse(localStorage.getItem("est"))[0].id;
    this.object.nomeEstabelecimento = JSON.parse(localStorage.getItem("est"))[0].nomeFantasia; 
  }

  estabelecimentoSelecionado(idEstabelecimento: any){            
    this.object.nomeEstabelecimento = this.domains[0].idEstabelecimento[idEstabelecimento.target.options.selectedIndex-1].nome;
  }

  livroSelecionado(livro: any){            
    this.object.nomeLivro = this.domains[0].idTipoMovimento[livro.target.options.selectedIndex-1].nome;
  }

  twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
  }
  
  createGroup() {
    this.form = this.fb.group({      
      idEstabelecimento: new FormControl({value: '', disabled: true}, Validators.required),   
      idLivro: ['', Validators.required],  
      dataInicial: ['', Validators.required],
      dataFinal: ['', Validators.required],
    });
  }
}