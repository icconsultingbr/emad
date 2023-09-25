import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Util } from '../../../_core/_util/Util';
import { ItemReceita } from '../../../_core/_models/ItemReceita';
import { Estoque } from '../../../_core/_models/Estoque';
import * as uuid from 'uuid';
import { MedicamentoMovimentoImpressaoService } from '../../../shared/services/medicamento-movimento.service';
import { MedicamentoMovimentoService } from './medicamento-movimento.service';
import { RelatorioMedicamento } from '../../../_core/_models/RelatorioMedicamento';
import { Material } from '../../../_core/_models/Material';

const myId = uuid.v4();

@Component({
    selector: 'app-medicamento-movimento-form',
    templateUrl: './medicamento-movimento.component.html',
    styleUrls: ['./medicamento-movimento.component.css'],
    providers: [MedicamentoMovimentoService]
})

export class MedicamentoMovimentoComponent implements OnInit {
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
    private service: MedicamentoMovimentoService,
    private ref: ChangeDetectorRef,
    private medicamentoMovimentoService: MedicamentoMovimentoImpressaoService) {
      this.fields = service.fields;
    }

  ngOnInit() {
    this.createGroup();
    this.loadDomains();
    this.object.ordenadoPor = 'mvg.dataMovimento';
    this.object.idEstabelecimento = JSON.parse(localStorage.getItem('est'))[0].id;
    this.object.nomeEstabelecimento = JSON.parse(localStorage.getItem('est'))[0].nomeFantasia;
  }

  loadDomains() {
    this.service.listDomains('estabelecimento').subscribe(estabelecimentos => {
        this.domains.push({
          idEstabelecimento: estabelecimentos,
          idOperacao: [
            { id: '1', nome: 'Entrada' },
            { id: '2', nome: 'Saída' },
            { id: '3', nome: 'Perda' }
          ],
          idTipoMovimento: [],
          ordenadoPor: [
            { id: 'mvg.dataMovimento', nome: 'Data movimento' },
            { id: 'mvg.id', nome: 'Documento' },
            { id: 'fab.nome', nome: 'Fabricante' },
            { id: 'img.lote', nome: 'Lote' },
            { id: 'mat.descricao', nome: 'Medicamento' },
            { id: ' tmv.nome', nome: 'Tipo movimento' },
          ],
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
    this.object.criteriosPesquisa.nomeOperacao = this.object.nomeOperacao;
    this.object.criteriosPesquisa.nomeTipoMovimento = this.object.nomeTipoMovimento;

    let dataInicialFiltro =  this.object.dataInicial.getFullYear() + '-' + this.twoDigits(1 + this.object.dataInicial.getMonth()) + '-' + this.twoDigits(this.object.dataInicial.getDate());
    let dataFinalFiltro =  this.object.dataFinal.getFullYear() + '-' + this.twoDigits(1 + this.object.dataFinal.getMonth()) + '-' + this.twoDigits(this.object.dataFinal.getDate());

    this.object.params = '?dataInicial=' + dataInicialFiltro
                       + '&dataFinal=' + dataFinalFiltro
                       + '&idMaterial=' + (this.object.idMaterial ? this.object.idMaterial : '')
                       + '&idEstabelecimento=' + (this.object.idEstabelecimento  ? this.object.idEstabelecimento : '')
                       + '&ordenadoPor=' + (this.object.ordenadoPor  ? this.object.ordenadoPor : '');

    this.medicamentoMovimentoService.imprimir(this.object, JSON.parse(localStorage.getItem('est'))[0].nomeFantasia, this.object.criteriosPesquisa);
  }

  exportarCsv() {
    this.errors = [];

    this.object.criteriosPesquisa = {};
    this.object.criteriosPesquisa.dataInicial = this.object.dataInicial;
    this.object.criteriosPesquisa.dataFinal = this.object.dataFinal;
    this.object.criteriosPesquisa.nomeProfissional = this.object.nomeProfissional;
    this.object.criteriosPesquisa.nomeMaterial = this.object.nomeMaterial;
    this.object.criteriosPesquisa.nomeEstabelecimento = this.object.nomeEstabelecimento;
    this.object.criteriosPesquisa.nomeOperacao = this.object.nomeOperacao;
    this.object.criteriosPesquisa.nomeTipoMovimento = this.object.nomeTipoMovimento;

    let dataInicialFiltro =  this.object.dataInicial.getFullYear() + '-' + this.twoDigits(1 + this.object.dataInicial.getMonth()) + '-' + this.twoDigits(this.object.dataInicial.getDate());
    let dataFinalFiltro =  this.object.dataFinal.getFullYear() + '-' + this.twoDigits(1 + this.object.dataFinal.getMonth()) + '-' + this.twoDigits(this.object.dataFinal.getDate());

    this.object.params = '?dataInicial=' + dataInicialFiltro
                       + '&dataFinal=' + dataFinalFiltro
                       + '&idMaterial=' + (this.object.idMaterial ? this.object.idMaterial : '')
                       + '&idEstabelecimento=' + (this.object.idEstabelecimento  ? this.object.idEstabelecimento : '')
                       + '&ordenadoPor=' + (this.object.ordenadoPor  ? this.object.ordenadoPor : '');

    this.medicamentoMovimentoService.exportar(this.object, JSON.parse(localStorage.getItem('est'))[0].nomeFantasia, this.object.criteriosPesquisa);
  }

  clear() {
    this.object = new RelatorioMedicamento();
    this.objectMaterial = new Material();
    this.ref.detectChanges();
    this.object.ordenadoPor = 'mvg.dataMovimento';
    this.object.idEstabelecimento = JSON.parse(localStorage.getItem('est'))[0].id;
    this.object.nomeEstabelecimento = JSON.parse(localStorage.getItem('est'))[0].nomeFantasia;
    this.domains[0].idTipoMovimento = [];
  }

  medicamentoSelecionado(material: any) {
    this.object.idMaterial = material.id;
    this.object.nomeMaterial = material.descricao;
  }

  estabelecimentoSelecionado(idEstabelecimento: any) {
    this.object.nomeEstabelecimento = this.domains[0].idEstabelecimento[idEstabelecimento.target.options.selectedIndex - 1].nome;
  }

  operacaoSelecionada(operacao: any) {
    this.object.nomeOperacao = this.domains[0].idOperacao[operacao.target.options.selectedIndex - 1].nome;
    this.message = '';
    this.errors = [];
    this.loading = true;
    this.service.carregaTipoMovimentoPorOperacao(this.object.idOperacao).subscribe(result => {
      this.domains[0].idTipoMovimento = result;
    }, error => {
      this.errors = Util.customHTTPResponse(error);
    });
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
      idEstabelecimento: new FormControl({value: '', disabled: true}, Validators.required),
      idOperacao: ['', Validators.required],
      idTipoMovimento: ['', Validators.required],
      ordenadoPor: ['', Validators.required],
      dataInicial: ['', Validators.required],
      dataFinal: ['', Validators.required],
    });
  }
}
