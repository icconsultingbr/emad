import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SolicitacaoRemanejamentoService } from './solicitacao-remanejamento.service';
import { PedidoCompra } from '../../../_core/_models/PedidoCompra';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemPedidoCompra } from '../../../_core/_models/ItemPedidoCompra';
import { Util } from '../../../_core/_util/Util';
import * as uuid from 'uuid';
import { Material } from '../../../_core/_models/Material';
import { SolicitacaoRemanejamento } from '../../../_core/_models/SolicitacaoRemanejamento';
import { ItemSolicitacaoRemanejamento } from '../../../_core/_models/ItemSolicitacaoRemanejamento';

@Component({
    selector: 'app-solicitacao-remanejamento-form',
    templateUrl: './solicitacao-remanejamento-form.component.html',
    styleUrls: ['./solicitacao-remanejamento-form.component.css'],
    providers: [SolicitacaoRemanejamentoService]
})

export class SolicitacaoRemanejamentoFormComponent implements OnInit {

  fields: any[] = [];
  label: String = 'solicitação de remanejamento';
  solicitacaoRemanejamento: SolicitacaoRemanejamento = new SolicitacaoRemanejamento();
  itemSolicitacaoRemanejamento: ItemSolicitacaoRemanejamento = new ItemSolicitacaoRemanejamento();
  id: number = null;
  domains: any[] = [];
  form: FormGroup;
  loading: Boolean = false;
  message = '';
  errors: any[] = [];
  listaMaterialLote: any[] = [];
  warning = '';
  objectMaterial: Material = new Material();

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
      idEstabelecimentoSolicitada: [{ value: '', disabled: this.id ? true : false }, ''],
      nomeEstabelecimentoSolicitante: ['', ''],
      qtdSolicitada: ['', ''],
      qtdAtendida: ['', '']
    });
  }

  toggleSolicitacao() {
    return Util.isEmpty(this.solicitacaoRemanejamento.idEstabelecimentoSolicitada)
    || Util.isEmpty(this.solicitacaoRemanejamento.idEstabelecimentoSolicitada);
  }

  toggleItemSolicitacaoRemanejamento() {
    return Util.isEmpty(this.itemSolicitacaoRemanejamento.idMaterial)
    || Util.isEmpty(this.itemSolicitacaoRemanejamento.idSolicitacaoRemanejamento)
    || Util.isEmpty(this.itemSolicitacaoRemanejamento.qtdSolicitada);
  }

  medicamentoSelecionado(material: any) {
    this.itemSolicitacaoRemanejamento.idMaterial = material.id;
    this.itemSolicitacaoRemanejamento.nomeMaterial = material.descricao;
    this.itemSolicitacaoRemanejamento.codigoMaterial = material.codigo;
  }

  confirmaItemSolicitacaoRemanejamento() {
    if (this.movimentoContemDivergencias()) {
    return;
    }

    this.itemSolicitacaoRemanejamento.idFront = uuid.v4();

    if (!this.solicitacaoRemanejamento.itensSolicitacaoRemanejamento) {
      this.solicitacaoRemanejamento.itensSolicitacaoRemanejamento = [];
    }

    this.solicitacaoRemanejamento.itensSolicitacaoRemanejamento.push(this.itemSolicitacaoRemanejamento);
    this.itemSolicitacaoRemanejamento = new ItemSolicitacaoRemanejamento();
    this.itemSolicitacaoRemanejamento.idSolicitacaoRemanejamento = this.id;
    this.listaMaterialLote = [];
    this.objectMaterial = new Material();
    this.ref.detectChanges();
  }

  removeItemSolicitacaoRemanejamento(item) {
    this.solicitacaoRemanejamento.itensSolicitacaoRemanejamento = this.solicitacaoRemanejamento.itensSolicitacaoRemanejamento.filter(itemExistente => itemExistente.idFront != item.idFront);
  }

  movimentoContemDivergencias() {
     this.errors = [];
     let erroQtd = false;
     let listaMaterialLoteExistente = [];
     listaMaterialLoteExistente =  Object.assign([], this.solicitacaoRemanejamento.itensSolicitacaoRemanejamento);

     this.solicitacaoRemanejamento.itensSolicitacaoRemanejamento.forEach(item => {

     const materialExistente = listaMaterialLoteExistente.filter(itemAdicionado => itemAdicionado.idMaterial == this.itemSolicitacaoRemanejamento.idMaterial);

     if (materialExistente.length > 0) {
        this.errors.push({
          message: 'Material já adicionado.'
        });
        erroQtd = true;
       }
      });
     return erroQtd;
  }

  sendForm(event) {
    this.errors = [];
    event.preventDefault();

    this.service
      .inserir(this.solicitacaoRemanejamento)
      .subscribe((res: any) => {
        if (this.solicitacaoRemanejamento.id) {
          this.back();
        } else {
          this.solicitacaoRemanejamento.id = res.id;
          this.itemSolicitacaoRemanejamento.idSolicitacaoRemanejamento = res.id;
          this.message = 'Solicitação ' + res.id + ' criada com sucesso!';
          this.solicitacaoRemanejamento.situacao = res.situacao;
          this.id = res.id;
          this.warning = '';
        }
      }, erro => {
        this.errors = Util.customHTTPResponse(erro);
      });
  }

  efetivarSolicitacao() {
    this.errors = [];

    this.solicitacaoRemanejamento.situacao = 4;
    this.solicitacaoRemanejamento.idTipoMovimento = 5;

    this.service
      .atender(this.solicitacaoRemanejamento)
      .subscribe((res: any) => {
        this.back();
      }, erro => {
        this.solicitacaoRemanejamento.situacao = 2;
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
    const route = 'solicitacoes-remanejamentos';
    this.router.navigate([route]);
  }
}
