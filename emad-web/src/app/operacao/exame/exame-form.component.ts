import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ExameService } from '../../shared/services/exame.service';
import { Exame } from '../../_core/_models/Exame';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Util } from '../../_core/_util/Util';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as uuid from 'uuid';
import { ItemExame } from '../../_core/_models/ItemExame';
import { ReciboExameImpressaoService } from '../../shared/services/recibo-exame-impressao.service';
import { FileUploadService } from '../../_core/_components/app-file-upload/services/file-upload.service';
const myId = uuid.v4();

@Component({
  selector: 'app-exame-form',
  templateUrl: './exame-form.component.html',
  styleUrls: ['./exame-form.component.css'],
  providers: [ExameService]
})

export class ExameFormComponent implements OnInit {
  @ViewChild('contentConfirmacao') contentConfirmacao: ElementRef;
  @ViewChild('contentRecibo') contentRecibo: ElementRef;
  @ViewChild('contentImprimirSolicitacaoExame') contentImprimirSolicitacaoExame: ElementRef;

  object: Exame = new Exame();
  itemExame: ItemExame = new ItemExame();
  method = 'exames';
  fields: any[] = [];
  label = 'Novo exame';
  id: number = null;
  domains: any[] = [];
  loading: Boolean = false;
  form: FormGroup;
  groupForm: any = {};
  type: string;
  message = '';
  warning = '';
  saveLabel = 'Salvar';
  errors: any[] = [];
  modalRef: NgbModalRef = null;
  listaItensExame: any[] = [];
  arquivosVisible = false;
  listaArquivosUpload: any[] = [];
  nomeProfissional: string;
  thumbnail: any;
  idTipoSolicitacaoExame: number;

  public images: any[] = [];

  constructor(
    private fb: FormBuilder,
    private service: ExameService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private reciboExameService: ReciboExameImpressaoService,
    private ref: ChangeDetectorRef,
    private router: Router,
    private fileUploadService: FileUploadService,
  ) {
    this.fields = service.fields;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.loadDomains();
      this.createGroup();

    });
  }

  loadDomains() {
    this.loading = true;
    this.service.listDomains('tipo-exame').subscribe(tipoExame => {
      this.service.listDomains('metodo-exame').subscribe(metodoExame => {
        this.domains.push({
          idTipoExame: tipoExame,
          idMetodoExame: metodoExame,
          idProdutoExame: [],
          idPaciente: [],
          resultado: [
            { id: 1, nome: 'Amostra não reagente' },
            { id: 2, nome: 'Amostra reagente' },
            { id: 3, nome: 'Não realizado' }
          ],
          resultadoFinal: [
            { id: 1, nome: 'Amostra não reagente' },
            { id: 2, nome: 'Amostra reagente' },
            { id: 3, nome: 'Não realizado' }
          ],
          idTipoSolicitacaoExame: [
            { id: 1, nome: 'Solicitação de Exame' },
            { id: 2, nome: 'Realização de Exame' }
          ],
          situacao: [
            { id: 1, nome: 'Em aberto' },
            { id: 2, nome: 'Finalizado' },
            { id: 3, nome: 'Agendado' }
          ]
        });
        if (!Util.isEmpty(this.id)) {
          this.carregaExame();
        }
      });
    });
  }

  close(retornaGrid: boolean) {
    if (this.modalRef) {
      this.modalRef.close();
    }

    if (retornaGrid) {
      this.back();
    }
  }

  back() {
    const route = this.method;
    this.router.navigate([route]);
  }

  sendForm(event, acao) {
    this.errors = [];
    event.preventDefault();
    this.object.acao = acao ? acao : 'A';
    this.close(false);

    this.service
      .inserir(this.object, 'exame')
      .subscribe((res: any) => {
        if (this.idTipoSolicitacaoExame == 1) {
          this.openConfirmacao(this.contentImprimirSolicitacaoExame);
        }
        if (this.object.id) {
          if (acao == 'F') {
            this.openConfirmacao(this.contentRecibo);
          } else {
            this.close(true);
          }
        } else {
          this.message = 'Exame ' + res.id + ' criada com sucesso!';
          this.object.id = res.id;
          this.object.situacao = res.situacao;
          this.arquivosVisible = true;
          this.id = res.id;
          this.service.list(`produto-exame/tipo-exame/${this.object.idTipoExame}`).subscribe(produtoExame => {
            this.domains[0].idProdutoExame = produtoExame;
            this.object.idTipoExame = this.object.idTipoExame;

          });
          this.service.list(`arquivo-exame/exame/${this.id}`).subscribe(arquivosExame => {
            this.listaArquivosUpload = arquivosExame;
          });
        }
        this.warning = '';
      }, erro => {
        this.errors = Util.customHTTPResponse(erro);
      });
  }

  carregaExame() {
    this.object.id = this.id;
    this.errors = [];
    this.message = '';
    this.loading = true;
    this.service.findById(this.id, 'exame').subscribe(result => {
      this.object = result;
      this.label = this.object.situacao == '1' ? 'Editar exame' : 'Visualizar exame (Situação: Finalizado)';
      this.arquivosVisible = true;
      this.object.dataAgendamento = new Date(this.object.dataAgendamento);

      this.service.list(`produto-exame/tipo-exame/${result.idTipoExame}`).subscribe(produtoExame => {
        this.domains[0].idProdutoExame = produtoExame;
        this.object.idTipoExame = result.idTipoExame;
      });
      this.service.list(`arquivo-exame/exame/${this.id}`).subscribe(arquivosExame => {
        this.listaArquivosUpload = arquivosExame;
      });
      this.loading = false;
    }, error => {
      this.object = new Exame();
      this.errors.push({
        message: 'Exame não encontrado'
      });
    });
  }

  pacienteSelecionado(object: any) {
    this.object.idPaciente = object.id;
  }

  toggleItem() {
    return Util.isEmpty(this.itemExame.idProdutoExame)
      || Util.isEmpty(this.itemExame.idMetodoExame)
      || Util.isEmpty(this.itemExame.resultado);
  }

  openConfirmacao(content: any) {
    this.modalRef = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'lg'
    });
  }

  removeItemArquivo(item: any) {
    this.service.removeArquivoExame(item).subscribe(produtoExame => {
      this.service.list(`arquivo-exame/exame/${this.id}`).subscribe(arquivosExame => {
        this.listaArquivosUpload = arquivosExame;
      });
    });
  }

  removeItemExame(item) {
    this.object.itensExame = this.object.itensExame.filter(itemExistente =>
      itemExistente.idProdutoExame != item.idProdutoExame);
  }

  abreReciboExame(exameId: number, retornaGrid: boolean) {
    this.close(retornaGrid);
    this.reciboExameService.imprimir(exameId);
  }

  createGroup() {
    this.form = this.fb.group({
      id: [''],
      nome: [Validators.required],
      pacienteNome: [Validators.required],
      ano: ['', ''],
      idEstabelecimento: ['', ''],
      idProdutoExame: ['', ''],
      idMetodoExame: ['', ''],
      idTipoExame: ['', ''],
      resultado: ['', ''],
      resultadoFinal: ['', ''],
      numero: ['', ''],
      dataEmissao: ['', ''],
      situacao: [Validators.required],
      qtdDispensarLote: ['', ''],
      idTipoSolicitacaoExame: ['', ''],
      descricaoSolicitacaoExame: ['', ''],
      dataAgendamento: ['', ''],
      local: ['', '']
    });
  }
  

  confirmaItem() {
    if (!this.object.itensExame) {
      this.object.itensExame = [];
    }

    this.itemExame.nomeProdutoExame = this.domains[0].idProdutoExame.filter(item => item.id == this.itemExame.idProdutoExame)[0].nome;
    this.itemExame.nomeMetodoExame = this.domains[0].idMetodoExame.filter(item => item.id == this.itemExame.idMetodoExame)[0].nome;
    this.itemExame.nomeResultado = this.domains[0].resultado.filter(item => item.id == this.itemExame.resultado)[0].nome;

    this.object.itensExame.push(this.itemExame);
    //this.listaItensExame.push(this.itemExame);
    this.itemExame = new ItemExame();
    this.ref.detectChanges();
  }

  openModal(content) {
    this.modalRef = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'lg'
    });
  }

  fileChangeEvent(event: any): void {
    this.images = event;
    this.ref.detectChanges();

    if (this.images.length > 0) {
      this.images.forEach(object => {
        {
          const reader = new FileReader();
          reader.onload = function () {
            object.base64 = reader.result;
          };
          reader.readAsDataURL(object);
        }
      });
    }
  }

  salvarDocumentos() {
    this.fileUploadService.uploadListImage(this.images).subscribe((result) => {
      result.forEach(object => {
        object.idExame = this.id;
        object.nomeProfissional = JSON.parse(localStorage.getItem('currentUser')).nome;
      });

      this.service.salvarArquivoExame(result).subscribe((result) => {
        if (result) {
          this.recarregarDocumentos();
        }
        if (this.modalRef) {
          this.modalRef.close();
        }
      });
    });
  }

  abrirDocumento(base: any) {

    if (base.tipo == 'pdf') {
      const pdf = document.createElement('embed');

      pdf.src = 'data:application/pdf;base64,' + base.base64;
      pdf.width = '100%';
      pdf.height = '100%';
      const w = window.open('');
      w.document.write(pdf.outerHTML);
    }
    else {
      const image = new Image();
      image.src = 'data:image/' + base.tipo + ';base64,' + base.base64;
      const w = window.open('');
      w.document.write(image.outerHTML);
    }
  }

  recarregarDocumentos() {
    this.service.list(`arquivo-exame/exame/${this.id}`).subscribe(arquivosExame => {
      this.listaArquivosUpload = arquivosExame;
    });
  }

}



