import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { ReverterAjusteEstoqueService } from './reverter-ajuste-estoque.service';
import { TipoMovimento } from '../../../_core/_models/TipoMovimento';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Util } from '../../../_core/_util/Util';
import { Material } from '../../../_core/_models/Material';
import { MovimentoGeral, ItemMovimentoGeral } from '../../../_core/_models/MovimentoGeral';
import * as uuid from 'uuid';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EstoqueImpressaoService } from '../../../shared/services/estoque-impressao.service';
import * as _moment from 'moment';
import { registerModuleFactory } from '@angular/core/src/linker/ng_module_factory_loader';
const myId = uuid.v4();

@Component({
    selector: 'app-reverter-juste-estoque-form',
    templateUrl: './reverter-ajuste-estoque-form.component.html',
    styleUrls: ['./reverter-ajuste-estoque-form.component.css'],
    providers: [ReverterAjusteEstoqueService]
})

export class ReverterAjusteEstoqueFormComponent implements OnInit {
  @ViewChild('contentRecibo') contentRecibo: ElementRef;

  method: String = 'estoque';
  fields: any[] = [];
  label: String = 'Reverter ajuste de estoque';
  movimento: MovimentoGeral = new MovimentoGeral();
  itemMovimento: ItemMovimentoGeral = new ItemMovimentoGeral();
  id: Number = null;
  domains: any[] = [];
  form: FormGroup;
  loading: Boolean = false;
  message = '';
  errors: any[] = [];
  listaMaterialLote: any[] = [];
  objectMaterial: Material = new Material();
  warning = '';
  modalRef: NgbModalRef = null;
  tipoMovimento: TipoMovimento = new TipoMovimento();

  constructor(
    private fb: FormBuilder,
    private service: ReverterAjusteEstoqueService,
    private ref: ChangeDetectorRef,
    private modalService: NgbModal,
    private estoqueImpressaoService: EstoqueImpressaoService,
    private route: ActivatedRoute) {

    }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });

    this.loadDomains();
    this.createGroup();
  }

  loadDomains() {
    this.service.list('tipo-movimento/administrativo').subscribe(tipoMovimento => {
      this.service.list('fabricante-material').subscribe(fabricante => {
        this.domains.push({
          idTipoMovimento: tipoMovimento,
          idFabricante: fabricante
        });
      });
    });
  }

  createGroup() {
    this.form = this.fb.group({
      id: [''],
      idTipoMovimento: ['', ''],
      motivo: ['', ''],
      idFabricante: ['', ''],
      idEstabelecimento: ['', ''],
      numeroEmpenho: ['', ''],
      validade: ['', ''],
      numeroDocumento: ['', ''],
      quantidade: ['', ''],
      idLoteAtual: ['', ''],
      lote: ['', ''],
      itemSelecionado: ['', '']
    });
  }

  togglePesquisa() {
    return Util.isEmpty(this.movimento.id);
  }

  pesquisaItemMovimentoGeral() {
    this.errors = [];
    this.loading = true;
       this.service.list('estoque/item-movimento/' + this.movimento.id).subscribe(result => {
        this.listaMaterialLote = result;
        this.loading = false;
        if (result.length == 0) {
          this.errors.push({
            message: 'Movimento não encontrado'
          });
        }
      }, error => {
        this.loading = false;
        this.errors = Util.customHTTPResponse(error);
      });
  }

  sendForm(event, acao) {
    this.errors = [];
    event.preventDefault();
    this.movimento.idMovimentoEstornado = this.movimento.id;

    if (this.listaMaterialLote.filter(itemExistente => itemExistente.itemSelecionado).length == 0) {
      this.errors.push({
        message: 'Nenhum item selecionado.'
      });
      return;
    }

    this.movimento.itensMovimento = this.listaMaterialLote.filter(itemExistente => itemExistente.itemSelecionado);

    this.service
      .inserirMaterialEstoque(this.movimento, 'entrada-material-estoque')
      .subscribe((res: any) => {
        this.movimento.id = res.id;
        this.movimento.dataMovimento = res.dataMovimento;
        this.openConfirmacao(this.contentRecibo);
        this.warning = '';
      }, erro => {
        this.errors = Util.customHTTPResponse(erro);
      });
  }

  openConfirmacao(content: any) {
    this.modalRef = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'lg'
    });
  }

  selectAll() {

  }

  close() {
    if (this.modalRef) {
      this.modalRef.close();
    }

    this.movimento = new MovimentoGeral();
    this.itemMovimento = new ItemMovimentoGeral();
    this.listaMaterialLote = [];
    this.objectMaterial = new Material();
    this.domains[0].idLoteAtual = [];
    this.ref.detectChanges();
  }

    abreRelatorio() {
    const dadosRelatorio: any = {};
    dadosRelatorio.idMovimentoGeral = this.movimento.id;
    dadosRelatorio.numeroDocumento = this.movimento.id;
    dadosRelatorio.dataMovimentacao = this.movimento.dataMovimento;
    this.estoqueImpressaoService.imprimir('ENTRADA_MATERIAL', 'Reversão de ajuste de estoque', this.movimento.nomeEstabelecimento, dadosRelatorio);
    this.close();
  }
}
