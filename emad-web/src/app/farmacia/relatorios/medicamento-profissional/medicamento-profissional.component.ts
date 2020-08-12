import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Util } from '../../../_core/_util/Util';
import { ItemReceita } from '../../../_core/_models/ItemReceita';
import { Estoque } from '../../../_core/_models/Estoque';
import * as uuid from 'uuid';
import { MedicamentoProfissionalImpressaoService } from '../../../shared/services/medicamento-profissional.service';
import { MedicamentoProfissionalService } from './medicamento-profissional.service';
import { RelatorioMedicamento } from '../../../_core/_models/RelatorioMedicamento';
import { Material } from '../../../_core/_models/Material';

const myId = uuid.v4();

@Component({
    selector: 'app-medicamento-profissional-form',
    templateUrl: './medicamento-profissional.component.html',
    styleUrls: ['./medicamento-profissional.component.css'],
    providers: [MedicamentoProfissionalService]
})

export class MedicamentoProfissionalComponent implements OnInit {  
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
    private service: MedicamentoProfissionalService, 
    private ref: ChangeDetectorRef, 
    private medicamentoProfissionalService: MedicamentoProfissionalImpressaoService) {
      this.fields = service.fields;
    }

  ngOnInit() {
    this.createGroup();
    this.loadDomains();  
    this.object.ordenadoPor = "qtdDispensada";
  }

  loadDomains() {       
    this.service.listDomains('estabelecimento').subscribe(estabelecimentos => {
      this.service.listDomains('profissional').subscribe(profissionais => {
        this.domains.push({            
          idEstabelecimento: estabelecimentos,
          idProfissional: profissionais,
          ordenadoPor: [
            { id: "qtdDispensada", nome: "Quantidade dispensada" },
            { id: "qtdPrescrita", nome: "Quantidade prescrita" },
            { id: "dataUltimaDispensacao", nome: "Data última dispensação" },
            { id: "nomeFantasia", nome: "Estabelecimento" },          
          ],
        });                           
      });                           
    });                           
  }      
  
  visualizarPdf() {        
    this.errors = [];

    if(!this.object.idProfissional){
      this.errors.push({
        message: "Escolha o profissional"
      });
      return;
    }

    this.object.criteriosPesquisa = {};
    this.object.criteriosPesquisa.dataInicial = this.object.dataInicial;
    this.object.criteriosPesquisa.dataFinal = this.object.dataFinal;
    this.object.criteriosPesquisa.nomeProfissional = this.object.nomeProfissional;
    this.object.criteriosPesquisa.nomeMaterial = this.object.nomeMaterial;
    this.object.criteriosPesquisa.nomeEstabelecimento = this.object.nomeEstabelecimento;

    var dataInicialFiltro =  this.object.dataInicial.getFullYear() + "-" + this.twoDigits(1 + this.object.dataInicial.getMonth()) + "-" + this.twoDigits(this.object.dataInicial.getDate());
    var dataFinalFiltro =  this.object.dataFinal.getFullYear() + "-" + this.twoDigits(1 + this.object.dataFinal.getMonth()) + "-" + this.twoDigits(this.object.dataFinal.getDate());

    this.object.params = "?dataInicial=" + dataInicialFiltro
                       + "&dataFinal=" + dataFinalFiltro
                       + "&idMaterial=" + (this.object.idMaterial ? this.object.idMaterial : '')
                       + "&idEstabelecimento=" + (this.object.idEstabelecimento  ? this.object.idEstabelecimento : '')
                       + "&ordenadoPor=" + (this.object.ordenadoPor  ? this.object.ordenadoPor : '');

    this.medicamentoProfissionalService.imprimir(this.object, JSON.parse(localStorage.getItem("est"))[0].nomeFantasia, this.object.criteriosPesquisa);    
  }

  exportarCsv(){

    this.errors = [];

    if(!this.object.idProfissional){
      this.errors.push({
        message: "Escolha o profissional"
      });
      return;
    }

    this.object.criteriosPesquisa = {};
    this.object.criteriosPesquisa.dataInicial = this.object.dataInicial;
    this.object.criteriosPesquisa.dataFinal = this.object.dataFinal;
    this.object.criteriosPesquisa.nomeProfissional = this.object.nomeProfissional;
    this.object.criteriosPesquisa.nomeMaterial = this.object.nomeMaterial;
    this.object.criteriosPesquisa.nomeEstabelecimento = this.object.nomeEstabelecimento;

    var dataInicialFiltro =  this.object.dataInicial.getFullYear() + "-" + this.twoDigits(1 + this.object.dataInicial.getMonth()) + "-" + this.twoDigits(this.object.dataInicial.getDate());
    var dataFinalFiltro =  this.object.dataFinal.getFullYear() + "-" + this.twoDigits(1 + this.object.dataFinal.getMonth()) + "-" + this.twoDigits(this.object.dataFinal.getDate());

    this.object.params = "?dataInicial=" + dataInicialFiltro
                       + "&dataFinal=" + dataFinalFiltro
                       + "&idMaterial=" + (this.object.idMaterial ? this.object.idMaterial : '')
                       + "&idEstabelecimento=" + (this.object.idEstabelecimento  ? this.object.idEstabelecimento : '')
                       + "&ordenadoPor=" + (this.object.ordenadoPor  ? this.object.ordenadoPor : '');


    this.medicamentoProfissionalService.exportar(this.object, JSON.parse(localStorage.getItem("est"))[0].nomeFantasia, this.object.criteriosPesquisa); 
  }

  clear(){
    this.object = new RelatorioMedicamento();
    this.objectMaterial = new Material();
    this.ref.detectChanges();
    this.object.ordenadoPor = "qtdDispensada";
  }

  medicamentoSelecionado(material: any){
    this.object.idMaterial = material.id;
    this.object.nomeMaterial = material.descricao;
  }

  estabelecimentoSelecionado(idEstabelecimento: any){            
    this.object.nomeEstabelecimento = this.domains[0].idEstabelecimento[idEstabelecimento.target.options.selectedIndex-1].nome;
  }

  profissionalSelecionado(profissional: any){            
    this.object.nomeProfissional = this.domains[0].idProfissional[profissional.target.options.selectedIndex-1].nome;
  }  

  twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
  }
  
  createGroup() {
    this.form = this.fb.group({      
      idEstabelecimento: ['', ''],      
      idProfissional: ['', Validators.required],      
      ordenadoPor: ['', Validators.required],
      dataInicial: ['', Validators.required],
      dataFinal: ['', Validators.required],
    });
  }
}