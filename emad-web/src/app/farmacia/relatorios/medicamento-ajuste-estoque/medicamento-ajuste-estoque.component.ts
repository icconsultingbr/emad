import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Util } from '../../../_core/_util/Util';
import { ItemReceita } from '../../../_core/_models/ItemReceita';
import { Estoque } from '../../../_core/_models/Estoque';
import * as uuid from 'uuid';
import { MedicamentoAjusteEstoqueImpressaoService } from '../../../shared/services/medicamento-ajuste-estoque.service';
import { MedicamentoAjusteEstoqueService } from './medicamento-ajuste-estoque.service';
import { RelatorioMedicamento } from '../../../_core/_models/RelatorioMedicamento';
import { Material } from '../../../_core/_models/Material';

const myId = uuid.v4();

@Component({
    selector: 'app-medicamento-ajuste-estoque-form',
    templateUrl: './medicamento-ajuste-estoque.component.html',
    styleUrls: ['./medicamento-ajuste-estoque.component.css'],
    providers: [MedicamentoAjusteEstoqueService]
})

export class MedicamentoAjusteEstoqueComponent implements OnInit {
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
    private service: MedicamentoAjusteEstoqueService,
    private ref: ChangeDetectorRef,
    private medicamentoAjusteEstoqueService: MedicamentoAjusteEstoqueImpressaoService) {
      this.fields = service.fields;
    }

  ngOnInit() {
    this.createGroup();
    this.loadDomains();
    this.object.ordenadoPor = 'ml.dataMovimentacao';
  }

  loadDomains() {
    this.service.listDomains('estabelecimento').subscribe(estabelecimentos => {
      this.service.list('tipo-movimento/administrativo').subscribe(tiposmovimentos => {
        this.domains.push({
          idEstabelecimento: estabelecimentos,
          idTipoMovimento: tiposmovimentos,
          ordenadoPor: [
            { id: 'ml.dataMovimentacao', nome: 'Data movimento' },
            { id: 'mat.descricao', nome: 'Medicamento' },
            { id: 'quantidade', nome: 'Quantidade' },
            { id: 'us.nome', nome: 'Login' },
            { id: 'motivo', nome: 'Motivo' },
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
    this.object.criteriosPesquisa.nomeTipoMovimento = this.object.nomeTipoMovimento;
    this.object.criteriosPesquisa.nomeMaterial = this.object.nomeMaterial;
    this.object.criteriosPesquisa.nomeEstabelecimento = this.object.nomeEstabelecimento;

    let dataInicialFiltro =  this.object.dataInicial.getFullYear() + '-' + this.twoDigits(1 + this.object.dataInicial.getMonth()) + '-' + this.twoDigits(this.object.dataInicial.getDate());
    let dataFinalFiltro =  this.object.dataFinal.getFullYear() + '-' + this.twoDigits(1 + this.object.dataFinal.getMonth()) + '-' + this.twoDigits(this.object.dataFinal.getDate());

    this.object.params = '?dataInicial=' + dataInicialFiltro
                       + '&dataFinal=' + dataFinalFiltro
                       + '&idMaterial=' + (this.object.idMaterial ? this.object.idMaterial : '')
                       + '&idTipoMovimento=' + (this.object.idTipoMovimento ? this.object.idTipoMovimento : '')
                       + '&idEstabelecimento=' + (this.object.idEstabelecimento  ? this.object.idEstabelecimento : '')
                       + '&ordenadoPor=' + (this.object.ordenadoPor  ? this.object.ordenadoPor : '');

    this.medicamentoAjusteEstoqueService.imprimir(this.object, JSON.parse(localStorage.getItem('est'))[0].nomeFantasia, this.object.criteriosPesquisa);
  }

  exportarCsv() {
    this.errors = [];

    this.object.criteriosPesquisa = {};
    this.object.criteriosPesquisa.dataInicial = this.object.dataInicial;
    this.object.criteriosPesquisa.dataFinal = this.object.dataFinal;
    this.object.criteriosPesquisa.nomeTipoMovimento = this.object.nomeTipoMovimento;
    this.object.criteriosPesquisa.nomeMaterial = this.object.nomeMaterial;
    this.object.criteriosPesquisa.nomeEstabelecimento = this.object.nomeEstabelecimento;

    let dataInicialFiltro =  this.object.dataInicial.getFullYear() + '-' + this.twoDigits(1 + this.object.dataInicial.getMonth()) + '-' + this.twoDigits(this.object.dataInicial.getDate());
    let dataFinalFiltro =  this.object.dataFinal.getFullYear() + '-' + this.twoDigits(1 + this.object.dataFinal.getMonth()) + '-' + this.twoDigits(this.object.dataFinal.getDate());

    this.object.params = '?dataInicial=' + dataInicialFiltro
                       + '&dataFinal=' + dataFinalFiltro
                       + '&idMaterial=' + (this.object.idMaterial ? this.object.idMaterial : '')
                       + '&idTipoMovimento=' + (this.object.idTipoMovimento ? this.object.idTipoMovimento : '')
                       + '&idEstabelecimento=' + (this.object.idEstabelecimento  ? this.object.idEstabelecimento : '')
                       + '&ordenadoPor=' + (this.object.ordenadoPor  ? this.object.ordenadoPor : '');

    this.medicamentoAjusteEstoqueService.exportar(this.object, JSON.parse(localStorage.getItem('est'))[0].nomeFantasia, this.object.criteriosPesquisa);
  }

  clear() {
    this.object = new RelatorioMedicamento();
    this.objectMaterial = new Material();
    this.ref.detectChanges();
    this.object.ordenadoPor = 'ml.dataMovimentacao';
  }

  medicamentoSelecionado(material: any) {
    this.object.idMaterial = material.id;
    this.object.nomeMaterial = material.descricao;
  }

  pacienteSelecionado(object: any) {
    this.object.idPaciente = object.id;
    this.object.nomePaciente = object.nome;
  }

  estabelecimentoSelecionado(idEstabelecimento: any) {
    this.object.nomeEstabelecimento = this.domains[0].idEstabelecimento[idEstabelecimento.target.options.selectedIndex - 1].nome;
  }

  tipoMovimentoSelecionado(tipoMovimento: any) {
    this.object.nomeTipoMovimento = this.domains[0].idTipoMovimento[tipoMovimento.target.options.selectedIndex - 1].nome;
  }

  twoDigits(d) {
    if (0 <= d && d < 10) { return '0' + d.toString(); }
    if (-10 < d && d < 0) { return '-0' + (-1 * d).toString(); }
    return d.toString();
  }

  createGroup() {
    this.form = this.fb.group({
      idEstabelecimento: ['', ''],
      idTipoMovimento: ['', ''],
      ordenadoPor: ['', Validators.required],
      dataInicial: ['', Validators.required],
      dataFinal: ['', Validators.required],
    });
  }
}
