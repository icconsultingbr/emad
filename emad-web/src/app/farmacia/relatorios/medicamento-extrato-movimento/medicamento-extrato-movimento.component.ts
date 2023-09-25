import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Util } from '../../../_core/_util/Util';
import { ItemReceita } from '../../../_core/_models/ItemReceita';
import { Estoque } from '../../../_core/_models/Estoque';
import * as uuid from 'uuid';
import { MedicamentoExtratoMovimentoImpressaoService } from '../../../shared/services/medicamento-extrato-movimento.service';
import { MedicamentoExtratoMovimentoService } from './medicamento-extrato-movimento.service';
import { RelatorioMedicamento } from '../../../_core/_models/RelatorioMedicamento';
import { Material } from '../../../_core/_models/Material';

const myId = uuid.v4();

@Component({
    selector: 'app-medicamento-extrato-movimento-form',
    templateUrl: './medicamento-extrato-movimento.component.html',
    styleUrls: ['./medicamento-extrato-movimento.component.css'],
    providers: [MedicamentoExtratoMovimentoService]
})

export class MedicamentoExtratoMovimentoComponent implements OnInit {
  object: RelatorioMedicamento = new RelatorioMedicamento();
  itemReceita: ItemReceita = new ItemReceita();
  itemEstoque: Estoque = new Estoque();
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
    private service: MedicamentoExtratoMovimentoService,
    private ref: ChangeDetectorRef,
    private medicamentoExtratoMovimentoService: MedicamentoExtratoMovimentoImpressaoService) {
      this.fields = service.fields;
    }

  ngOnInit() {
    this.createGroup();
    this.loadDomains();
  }

  loadDomains() {
    this.service.listDomains('estabelecimento').subscribe(estabelecimentos => {
      this.domains.push({
        idEstabelecimento: estabelecimentos
      });
    });
  }

  visualizarPdf() {
    this.errors = [];

    if (!this.object.idMaterial) {
      this.errors.push({
        message: 'Escolha o medicamento'
      });
      return;
    }

    this.object.criteriosPesquisa = {};
    this.object.criteriosPesquisa.dataInicial = this.object.dataInicial;
    this.object.criteriosPesquisa.dataFinal = this.object.dataFinal;
    this.object.criteriosPesquisa.nomeMaterial = this.object.nomeMaterial;
    this.object.criteriosPesquisa.nomeEstabelecimento = this.object.nomeEstabelecimento;

    let dataInicialFiltro =  this.object.dataInicial.getFullYear() + '-' + this.twoDigits(1 + this.object.dataInicial.getMonth()) + '-' + this.twoDigits(this.object.dataInicial.getDate());
    let dataFinalFiltro =  this.object.dataFinal.getFullYear() + '-' + this.twoDigits(1 + this.object.dataFinal.getMonth()) + '-' + this.twoDigits(this.object.dataFinal.getDate());

    this.object.params = '?dataInicial=' + dataInicialFiltro
                       + '&dataFinal=' + dataFinalFiltro
                       + '&idMaterial=' + (this.object.idMaterial ? this.object.idMaterial : '')
                       + '&idEstabelecimento=' + (this.object.idEstabelecimento  ? this.object.idEstabelecimento : '');

    this.medicamentoExtratoMovimentoService.imprimir(this.object, JSON.parse(localStorage.getItem('est'))[0].nomeFantasia, this.object.criteriosPesquisa);
  }

  exportarCsv() {
    this.errors = [];

    if (!this.object.idMaterial) {
      this.errors.push({
        message: 'Escolha o medicamento'
      });
      return;
    }

    this.object.criteriosPesquisa = {};
    this.object.criteriosPesquisa.dataInicial = this.object.dataInicial;
    this.object.criteriosPesquisa.dataFinal = this.object.dataFinal;
    this.object.criteriosPesquisa.nomeMaterial = this.object.nomeMaterial;
    this.object.criteriosPesquisa.nomeEstabelecimento = this.object.nomeEstabelecimento;

    let dataInicialFiltro =  this.object.dataInicial.getFullYear() + '-' + this.twoDigits(1 + this.object.dataInicial.getMonth()) + '-' + this.twoDigits(this.object.dataInicial.getDate());
    let dataFinalFiltro =  this.object.dataFinal.getFullYear() + '-' + this.twoDigits(1 + this.object.dataFinal.getMonth()) + '-' + this.twoDigits(this.object.dataFinal.getDate());

    this.object.params = '?dataInicial=' + dataInicialFiltro
                       + '&dataFinal=' + dataFinalFiltro
                       + '&idMaterial=' + (this.object.idMaterial ? this.object.idMaterial : '')
                       + '&idEstabelecimento=' + (this.object.idEstabelecimento  ? this.object.idEstabelecimento : '');

    this.medicamentoExtratoMovimentoService.exportar(this.object, JSON.parse(localStorage.getItem('est'))[0].nomeFantasia, this.object.criteriosPesquisa);
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

  estabelecimentoSelecionado(idEstabelecimento: any) {
    this.object.nomeEstabelecimento = this.domains[0].idEstabelecimento[idEstabelecimento.target.options.selectedIndex - 1].nome;
  }

  twoDigits(d) {
    if (0 <= d && d < 10) { return '0' + d.toString(); }
    if (-10 < d && d < 0) { return '-0' + (-1 * d).toString(); }
    return d.toString();
  }

  createGroup() {
    this.form = this.fb.group({
      idEstabelecimento: new FormControl({value: '', disabled: false}, Validators.required),
      dataInicial: ['', Validators.required],
      dataFinal: ['', Validators.required],
    });
  }
}
