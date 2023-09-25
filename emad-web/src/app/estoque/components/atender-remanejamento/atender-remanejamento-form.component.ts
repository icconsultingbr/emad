import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemPedidoCompra } from '../../../_core/_models/ItemPedidoCompra';
import { Util } from '../../../_core/_util/Util';
import * as uuid from 'uuid';
import { Material } from '../../../_core/_models/Material';
import { SolicitacaoRemanejamento } from '../../../_core/_models/SolicitacaoRemanejamento';
import { ItemSolicitacaoRemanejamento } from '../../../_core/_models/ItemSolicitacaoRemanejamento';
import { SolicitacaoRemanejamentoService } from '../solicitacao-remanejamento/solicitacao-remanejamento.service';

@Component({
    selector: 'app-atender-remanejamento-form',
    templateUrl: './atender-remanejamento-form.component.html',
    styleUrls: ['./atender-remanejamento-form.component.css'],
    providers: [SolicitacaoRemanejamentoService]
})

export class AtenderRemanejamentoFormComponent implements OnInit {

  fields: any[] = [];
  label: String = 'solicitação de remanejamento';
  solicitacaoRemanejamento: SolicitacaoRemanejamento = new SolicitacaoRemanejamento();
  itemSolicitacaoRemanejamento: ItemSolicitacaoRemanejamento = new ItemSolicitacaoRemanejamento();
  listaMaterialLoteDispensado: any[] = [];
  id: number = null;
  domains: any[] = [];
  form: FormGroup;
  loading: Boolean = false;
  message = '';
  errors: any[] = [];
  listaMaterialLote: any[] = [];
  warning = '';
  objectMaterial: Material = new Material();
  listaMaterialAguardandoAtendimento: any[] = [];

  constructor(
    private fb: FormBuilder,
    private service: SolicitacaoRemanejamentoService,
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router) {

    }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      if (!Util.isEmpty(this.id)) {
        this.carregaSolicitacaoRemanejamento();
      }
    });

    this.createGroup();
    this.loadDomains();
  }

  loadDomains() {
    this.service.listDomains('estabelecimento').subscribe(estabelecimentoSolicitada => {
      this.service.listDomains('estabelecimento').subscribe(estabelecimentoSolicitante => {
        this.domains.push({
          idEstabelecimentoSolicitada: estabelecimentoSolicitada,
          idEstabelecimentoSolicitante: estabelecimentoSolicitante
        });
      });
    });
  }

  createGroup() {
    this.form = this.fb.group({
      id: [''],
      idEstabelecimentoSolicitante: ['', ''],
      idEstabelecimentoSolicitada: [{ value: '', disabled: true }, ''],
      nomeEstabelecimentoSolicitante: ['', ''],
      qtdSolicitada: ['', ''],
      qtdAtendida: ['', ''],
      qtdDispensarLote: ['', '']
    });
  }

  atenderSolicitacao(event) {
    this.errors = [];
    event.preventDefault();

    if (this.listaMaterialLoteDispensado.length == 0) {
      this.errors.push({
        message: 'Solicitação não pôde ser atendida, pois nenhum Lote/Fabricante foi selecionado.'
      });
      return;
    }

    this.solicitacaoRemanejamento.situacao = 3;
    this.solicitacaoRemanejamento.idTipoMovimento = 4;

    this.service
      .atender(this.solicitacaoRemanejamento)
      .subscribe((res: any) => {
        this.back();
      }, erro => {
        this.solicitacaoRemanejamento.situacao = 2;
        this.errors = Util.customHTTPResponse(erro);
      });
  }

  naoAtenderSolicitacao() {
    this.errors = [];

    this.solicitacaoRemanejamento.situacao = 5;

    this.service
      .inserir(this.solicitacaoRemanejamento)
      .subscribe((res: any) => {
        this.back();
      }, erro => {
        this.errors = Util.customHTTPResponse(erro);
      });
  }

  carregaSolicitacaoRemanejamento() {
    this.solicitacaoRemanejamento.id = this.id;
    this.errors = [];
    this.message = '';
    this.loading = true;
    this.service.findById(this.id, 'solicitacao-remanejamento').subscribe(result => {
      this.solicitacaoRemanejamento = result;
      this.listaMaterialAguardandoAtendimento = this.solicitacaoRemanejamento.itensSolicitacaoRemanejamento;
      this.itemSolicitacaoRemanejamento.idSolicitacaoRemanejamento = result.id;
      this.loading = false;
    }, error => {
      this.solicitacaoRemanejamento = new SolicitacaoRemanejamento();
      this.errors.push({
        message: 'Solicitação de remanejamento não encontrada'
      });
    });
  }

  back() {
    const route = 'atendimentos-remanejamentos';
    this.router.navigate([route]);
  }

  carregaLotePorMaterial(idMaterial: number, item: any) {
    this.errors = [];
    if (item) {
      if (!item.qtdAtendida || item.qtdAtendida == 0) {
        this.errors.push({
          message: 'Informe a quantidade a ser atendida'
        });
        return;
      }

      if (item.qtdAtendida > item.qtdSolicitada) {
        this.errors.push({
          message: 'Quantidade atendida é maior que a quantidade solicitada'
        });
        return;
      }

      this.itemSolicitacaoRemanejamento.idMaterial = item.idMaterial;
      this.itemSolicitacaoRemanejamento.qtdAtendida = item.qtdAtendida;

      this.listaMaterialAguardandoAtendimento.forEach(itemEstoque => {
        itemEstoque.expandir = (itemEstoque.id == item.id && itemEstoque.expandir == true) ? true : false;
      });

      item.expandir = !item.expandir;
    }

    this.loading = true;
    const params = '?idMaterial=' + idMaterial + '&idEstabelecimento=' + JSON.parse(localStorage.getItem('est'))[0].id;
    this.service.list(`estoque${params}`).subscribe(estoque => {
      this.listaMaterialLote = estoque;
      this.loading = false;
    }, erro => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(erro);
    });
  }

  confirmaItemSolicitacaoRemanejamento(item: any) {
    if (this.estoqueContemDivergencias()) {
      return;
    }

    this.listaMaterialLote.forEach(novoItemEstoque => {
      if (novoItemEstoque.qtdDispensar > 0) {
        this.itemSolicitacaoRemanejamento.itensEstoque.push(novoItemEstoque);
        this.listaMaterialLoteDispensado.push(novoItemEstoque);
      }
    });

    this.solicitacaoRemanejamento.itensSolicitacaoRemanejamento.forEach(itemReceitaExistente => {
      if (itemReceitaExistente.idMaterial == item.idMaterial) {
        itemReceitaExistente.qtdAtendida = this.itemSolicitacaoRemanejamento.qtdAtendida;
        itemReceitaExistente.itensEstoque = this.itemSolicitacaoRemanejamento.itensEstoque;
      }
    });
    this.itemSolicitacaoRemanejamento = new ItemSolicitacaoRemanejamento();
    this.listaMaterialLote = [];
    this.listaMaterialAguardandoAtendimento = this.listaMaterialAguardandoAtendimento.filter(itemExistente => itemExistente.idMaterial != item.idMaterial);
  }

  estoqueContemDivergencias() {
    this.errors = [];
    let erroQtd = false;
    let somaDispensar = 0;
    let listaMaterialLoteExistente = [];
    listaMaterialLoteExistente =  Object.assign([], this.listaMaterialLoteDispensado);

    this.listaMaterialLote.forEach(item => {
      if (item.qtdDispensar > 0 && item.qtdDispensar != 'undefined') {
        if (item.qtdDispensar > item.quantidade) {
          this.errors.push({
            message: 'Quantidade a dispensar por lote é maior que a quantidade existente no lote (' + item.lote + ')'
          });
          erroQtd = true;
        }
        somaDispensar = somaDispensar + Number(item.qtdDispensar);

        const medicamentoExistenteComLote = listaMaterialLoteExistente.filter(itemAdicionado => itemAdicionado.idMaterial == this.itemSolicitacaoRemanejamento.idMaterial
                                                                      && itemAdicionado.lote == item.lote && itemAdicionado.idFabricanteMaterial == item.idFabricanteMaterial);

        if (medicamentoExistenteComLote.length > 0) {
          this.errors.push({
            message: 'O material ' + this.itemSolicitacaoRemanejamento.nomeMaterial + ' já foi adicionado com o lote (' + item.lote + '). Para alterar a quantidade remova o item e insira novamente.'
          });
          erroQtd = true;
        }
      }
    });

    const medicamentoExistenteSemLote = listaMaterialLoteExistente.filter(itemAdicionado => itemAdicionado.idMaterial == this.itemSolicitacaoRemanejamento.idMaterial && !itemAdicionado.lote && !itemAdicionado.idFabricanteMaterial);

    if (medicamentoExistenteSemLote.length > 0) {
      this.errors.push({
        message: 'O material ' + this.itemSolicitacaoRemanejamento.nomeMaterial + ' já foi adicionado. Para alterar a quantidade remova o item e insira novamente.'
      });
      erroQtd = true;
    }

    if (somaDispensar != this.itemSolicitacaoRemanejamento.qtdAtendida && (somaDispensar > 0 || this.itemSolicitacaoRemanejamento.qtdAtendida > 0)) {
      erroQtd = true;
      this.errors.push({
        message: 'A soma dos lotes é diferente da quantidade escolhida para dispensar!'
      });
    }
    return erroQtd;
  }
}
