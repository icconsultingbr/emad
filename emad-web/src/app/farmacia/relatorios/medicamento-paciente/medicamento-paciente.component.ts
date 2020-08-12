import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Util } from '../../../_core/_util/Util';
import { ItemReceita } from '../../../_core/_models/ItemReceita';
import { Estoque } from '../../../_core/_models/Estoque';
import * as uuid from 'uuid';
import { MedicamentoPacienteImpressaoService } from '../../../shared/services/medicamento-paciente.service';
import { MedicamentoPacienteService } from './medicamento-paciente.service';
import { RelatorioMedicamento } from '../../../_core/_models/RelatorioMedicamento';
import { Material } from '../../../_core/_models/Material';
import { ExportToCsv } from 'export-to-csv';

const myId = uuid.v4();

@Component({
    selector: 'app-medicamento-paciente-form',
    templateUrl: './medicamento-paciente.component.html',
    styleUrls: ['./medicamento-paciente.component.css'],
    providers: [MedicamentoPacienteService]
})

export class MedicamentoPacienteComponent implements OnInit {  
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
    private service: MedicamentoPacienteService, 
    private ref: ChangeDetectorRef, 
    private medicamentoPacienteService: MedicamentoPacienteImpressaoService) {
      this.fields = service.fields;
    }

  ngOnInit() {
    this.createGroup();
    this.loadDomains();   
  }

  loadDomains() {       
    this.service.listDomains('estabelecimento').subscribe(estabelecimentos => {
      this.domains.push({            
        idEstabelecimento: estabelecimentos,
        ordenadoPor: [
          { id: "mvg.dataMovimento", nome: "Data retirada" },
          { id: "img.idFabricante", nome: "Fabricante" },
          { id: "img.lote", nome: "Lote" },
          { id: "img.idMaterial", nome: "Medicamento" },
          { id: "irc.idReceita", nome: "Número da receita" },
        ],
      });                           
    });                           
  }      
  
  abreReceitaMedica() {        
    this.errors = [];

    if(!this.object.idPaciente){
      this.errors.push({
        message: "Escolha o paciente"
      });
      return;
    }

    this.object.criteriosPesquisa = {};
    this.object.criteriosPesquisa.dataInicial = this.object.dataInicial;
    this.object.criteriosPesquisa.dataFinal = this.object.dataFinal;
    this.object.criteriosPesquisa.nomePaciente = this.object.nomePaciente;
    this.object.criteriosPesquisa.nomeMaterial = this.object.nomeMaterial;
    this.object.criteriosPesquisa.nomeEstabelecimento = this.object.nomeEstabelecimento;
    
    var dataInicialFiltro =  this.object.dataInicial.getFullYear() + "-" + this.twoDigits(1 + this.object.dataInicial.getMonth()) + "-" + this.twoDigits(this.object.dataInicial.getDate());
    var dataFinalFiltro =  this.object.dataFinal.getFullYear() + "-" + this.twoDigits(1 + this.object.dataFinal.getMonth()) + "-" + this.twoDigits(this.object.dataFinal.getDate());

    this.object.params = "?dataInicial=" + dataInicialFiltro
                       + "&dataFinal=" + dataFinalFiltro
                       + "&idMaterial=" + (this.object.idMaterial ? this.object.idMaterial : '')
                       + "&idEstabelecimento=" + (this.object.idEstabelecimento  ? this.object.idEstabelecimento : '')
                       + "&ordenadoPor=" + (this.object.ordenadoPor  ? this.object.ordenadoPor : '');

    this.medicamentoPacienteService.imprimir(this.object, JSON.parse(localStorage.getItem("est"))[0].nomeFantasia, this.object.criteriosPesquisa);    
  }

  exportarCsv(){

    this.errors = [];

    if(!this.object.idPaciente){
      this.errors.push({
        message: "Escolha o paciente"
      });
      return;
    }

    this.object.criteriosPesquisa = {};
    this.object.criteriosPesquisa.dataInicial = this.object.dataInicial;
    this.object.criteriosPesquisa.dataFinal = this.object.dataFinal;
    this.object.criteriosPesquisa.nomePaciente = this.object.nomePaciente;
    this.object.criteriosPesquisa.nomeMaterial = this.object.nomeMaterial;
    this.object.criteriosPesquisa.nomeEstabelecimento = this.object.nomeEstabelecimento;

    var dataInicialFiltro =  this.object.dataInicial.getFullYear() + "-" + this.twoDigits(1 + this.object.dataInicial.getMonth()) + "-" + this.twoDigits(this.object.dataInicial.getDate());
    var dataFinalFiltro =  this.object.dataFinal.getFullYear() + "-" + this.twoDigits(1 + this.object.dataFinal.getMonth()) + "-" + this.twoDigits(this.object.dataFinal.getDate());

    this.object.params = "?dataInicial=" + dataInicialFiltro
                       + "&dataFinal=" + dataFinalFiltro
                       + "&idMaterial=" + (this.object.idMaterial ? this.object.idMaterial : '')
                       + "&idEstabelecimento=" + (this.object.idEstabelecimento  ? this.object.idEstabelecimento : '')
                       + "&ordenadoPor=" + (this.object.ordenadoPor  ? this.object.ordenadoPor : '');


    this.medicamentoPacienteService.exportar(this.object, JSON.parse(localStorage.getItem("est"))[0].nomeFantasia, this.object.criteriosPesquisa); 
  }

  clear(){
    this.object = new RelatorioMedicamento();
    this.objectMaterial = new Material();
    this.ref.detectChanges();
  }

  medicamentoSelecionado(material: any){
    this.object.idMaterial = material.id;
    this.object.nomeMaterial = material.descricao;
  }

  pacienteSelecionado(object: any){
    this.object.idPaciente = object.id;
    this.object.nomePaciente = object.nome;
  }

  estabelecimentoSelecionado(idEstabelecimento: any){            
    this.object.nomeEstabelecimento = this.domains[0].idEstabelecimento[idEstabelecimento.target.options.selectedIndex-1].nome;
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
    });
  }
}