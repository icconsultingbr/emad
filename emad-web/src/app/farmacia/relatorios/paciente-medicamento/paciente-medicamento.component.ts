import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Util } from '../../../_core/_util/Util';
import { ItemReceita } from '../../../_core/_models/ItemReceita';
import { Estoque } from '../../../_core/_models/Estoque';
import * as uuid from 'uuid';
import { PacienteMedicamentoImpressaoService } from '../../../shared/services/paciente-medicamento.service';
import { PacienteMedicamentoService } from './paciente-medicamento.service';
import { RelatorioMedicamento } from '../../../_core/_models/RelatorioMedicamento';
import { Material } from '../../../_core/_models/Material';

const myId = uuid.v4();

@Component({
    selector: 'app-paciente-medicamento-form',
    templateUrl: './paciente-medicamento.component.html',
    styleUrls: ['./paciente-medicamento.component.css'],
    providers: [PacienteMedicamentoService]
})

export class PacienteMedicamentoComponent implements OnInit {
  object: RelatorioMedicamento = new RelatorioMedicamento();
  itemReceita: ItemReceita = new ItemReceita();
  itemEstoque: Estoque = new Estoque();
  method = 'receitas';
  fields: any[] = [];
  label = '';
  id: number = null;
  domains: any[] = [];
  loading: Boolean = false;
  form: FormGroup;
  groupForm: any = {};
  type: string;
  message = '';
  warning = '';
  errors: any[] = [];
  objectMaterial: Material = new Material();

  constructor(
    private fb: FormBuilder,
    private service: PacienteMedicamentoService,
    private ref: ChangeDetectorRef,
    private medicamentoPacienteService: PacienteMedicamentoImpressaoService) {
      this.fields = service.fields;
    }

  ngOnInit() {
    this.createGroup();
    this.loadDomains();
  }

  loadDomains() {
    this.service.listDomains('estabelecimento').subscribe(estabelecimentos => {
      this.service.listDomains('fabricante-material').subscribe(fabricante => {
        this.domains.push({
          idEstabelecimento: estabelecimentos,
          idFabricanteMaterial: fabricante,
          ordenadoPor: [
            { id: 'mvg.dataMovimento', nome: 'Data retirada' },
            { id: 'img.idFabricante', nome: 'Fabricante' },
            { id: 'img.lote', nome: 'Lote' },
            { id: 'pac.nome', nome: 'Paciente' }
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

    let dataInicialFiltro =  this.object.dataInicial.getFullYear() + '-' + this.twoDigits(1 + this.object.dataInicial.getMonth()) + '-' + this.twoDigits(this.object.dataInicial.getDate());
    let dataFinalFiltro =  this.object.dataFinal.getFullYear() + '-' + this.twoDigits(1 + this.object.dataFinal.getMonth()) + '-' + this.twoDigits(this.object.dataFinal.getDate());

    this.object.params = '?dataInicial=' + dataInicialFiltro
                       + '&dataFinal=' + dataFinalFiltro
                       + '&idMaterial=' + (this.object.idMaterial ? this.object.idMaterial : '')
                       + '&idEstabelecimento=' + (this.object.idEstabelecimento  ? this.object.idEstabelecimento : '')
                       + '&idFabricante=' + (this.object.idFabricanteMaterial  ? this.object.idFabricanteMaterial : '')
                       + '&lote=' + (this.object.lote  ? this.object.lote : '')
                       + '&ordenadoPor=' + (this.object.ordenadoPor  ? this.object.ordenadoPor : '');

    this.medicamentoPacienteService.imprimir(this.object, JSON.parse(localStorage.getItem('est'))[0].nomeFantasia, this.object.criteriosPesquisa);
  }

  exportarCsv() {
    this.errors = [];

    this.object.criteriosPesquisa = {};
    this.object.criteriosPesquisa.dataInicial = this.object.dataInicial;
    this.object.criteriosPesquisa.dataFinal = this.object.dataFinal;
    this.object.criteriosPesquisa.nomePaciente = this.object.nomePaciente;
    this.object.criteriosPesquisa.nomeMaterial = this.object.nomeMaterial;
    this.object.criteriosPesquisa.nomeEstabelecimento = this.object.nomeEstabelecimento;
    this.object.criteriosPesquisa.nomeFabricanteMaterial = this.object.nomeFabricanteMaterial;
    this.object.criteriosPesquisa.lote = this.object.lote;

    let dataInicialFiltro =  this.object.dataInicial.getFullYear() + '-' + this.twoDigits(1 + this.object.dataInicial.getMonth()) + '-' + this.twoDigits(this.object.dataInicial.getDate());
    let dataFinalFiltro =  this.object.dataFinal.getFullYear() + '-' + this.twoDigits(1 + this.object.dataFinal.getMonth()) + '-' + this.twoDigits(this.object.dataFinal.getDate());

    this.object.params = '?dataInicial=' + dataInicialFiltro
                       + '&dataFinal=' + dataFinalFiltro
                       + '&idMaterial=' + (this.object.idMaterial ? this.object.idMaterial : '')
                       + '&idEstabelecimento=' + (this.object.idEstabelecimento  ? this.object.idEstabelecimento : '')
                       + '&idFabricante=' + (this.object.idFabricanteMaterial  ? this.object.idFabricanteMaterial : '')
                       + '&lote=' + (this.object.lote  ? this.object.lote : '')
                       + '&ordenadoPor=' + (this.object.ordenadoPor  ? this.object.ordenadoPor : '');


    this.medicamentoPacienteService.exportar(this.object, JSON.parse(localStorage.getItem('est'))[0].nomeFantasia, this.object.criteriosPesquisa);
  }

  clear() {
    this.object = new RelatorioMedicamento();
    this.objectMaterial = new Material();
    this.ref.detectChanges();
  }

  medicamentoSelecionado(material: any) {
    this.object.idMaterial = material.id;
    this.object.nomeMaterial = material.descricao;
  }

  pacienteSelecionado(object: any) {
    this.object.idPaciente = object.id;
    this.object.nomePaciente = object.nome;
  }

  estabelecimentoSelecionado(estabelecimento: any) {
    this.object.nomeEstabelecimento = this.domains[0].idEstabelecimento[estabelecimento.target.options.selectedIndex - 1].nome;
  }

  fabricanteSelecionado(fabricante: any) {
    this.object.nomeFabricanteMaterial = this.domains[0].idFabricanteMaterial[fabricante.target.options.selectedIndex - 1].nome;
  }

  twoDigits(d) {
    if (0 <= d && d < 10) { return '0' + d.toString(); }
    if (-10 < d && d < 0) { return '-0' + (-1 * d).toString(); }
    return d.toString();
  }

  createGroup() {
    this.form = this.fb.group({
      idEstabelecimento: ['', ''],
      ordenadoPor: ['', Validators.required],
      dataInicial: ['', Validators.required],
      dataFinal: ['', Validators.required],
      lote: ['', ''],
      idFabricanteMaterial: ['', ''],
    });
  }
}
