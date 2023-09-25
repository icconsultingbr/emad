import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { NgbModalRef, NgbModal, NgbCalendarIslamicUmalqura } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Util } from '../../_core/_util/Util';
import { Router, ActivatedRoute } from '@angular/router';
import { EspecialidadeEntidadeCampoService } from './especialidade-entidade-campo.service';
import { EspecialidadeEntidadeCampo } from '../../_core/_models/EspecialidadeEntidadeCampo';
import { AusenciaProfissional } from '../../_core/_models/AusenciaProfissional';
import { Material } from '../../_core/_models/Material';
import { PagerService } from '../../_core/_services/pager.service';

@Component({
  selector: 'app-especialidade-entidade-campo-form',
  templateUrl: './especialidade-entidade-campo-form.component.html',
  styleUrls: ['./especialidade-entidade-campo-form.component.css'],
  providers: [EspecialidadeEntidadeCampoService]
})

export class EspecialidadeEntidadeCampoFormComponent implements OnInit {
  //MESSAGES
  loading: Boolean = false;
  message = '';
  errors: any[] = [];
  modalRef: NgbModalRef = null;
  modalRemoveRef: NgbModalRef = null;
  form: FormGroup;
  method = 'especialidade-material';
  ausenciaProfissional: AusenciaProfissional = new AusenciaProfissional();
  fields: any[] = [];
  object: EspecialidadeEntidadeCampo = new EspecialidadeEntidadeCampo();
  domains: any[] = [];
  allItemsEntidadeCampo: any[] = [];
  allItemsPesquisaMaterial: any[] = [];
  material: Material = new Material();
  idEspecialidade: number;
  materialSelecionado: any = null;
  idEspecialidadeEntidadeCampoExclusao: number;

  //PAGINATION
  allItems: any[] = [];
  pager: any = {};
  pagedItems: any[];
  pageLimit = 10;
  fieldsPacientes: any[] = [];

  constructor(
    private fb: FormBuilder,
    private pagerService: PagerService,
    private service: EspecialidadeEntidadeCampoService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router) {
      for (const field of this.service.fields) {
        if (field.grid) {
          this.fields.push(field);
        }
      }
    }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.idEspecialidade = params['id'];

      this.domains.push({
        idEspecialidade: []
      });

      this.buscaEspecialidades();
      this.createGroup();

      if (!Util.isEmpty(this.idEspecialidade)) {
        this.object.idEspecialidade = this.idEspecialidade;
        this.carregaEntidadeCampoPorEspecialidade();
      }
    });
  }

  buscaEspecialidades() {
    this.loading = true;
       this.service.list('especialidade').subscribe(result => {
        this.domains[0].idEspecialidade = result;
        this.loading = false;
      }, error => {
        this.loading = false;
        this.errors = Util.customHTTPResponse(error);
      });
  }

  createGroup() {
    this.form = this.fb.group({
      idEspecialidade: [''],
      idMaterial: ['', '']
    });
  }

  salvaMedicamento() {
    this.message = '';
    this.errors = [];
    this.loading = true;

    if (!this.materialSelecionado.id) {
      this.errors = [{message: 'Selecione o material'}];
      this.loading = false;
      return;
    }

    if (!this.object.idEspecialidade) {
      this.errors = [{message: 'Selecione o material'}];
      this.loading = false;
      return;
    }

    this.object.idEntidadeCampo = this.materialSelecionado.id;

    this.service.salvaEntidadeCampo(this.object).subscribe(result => {
      this.message = 'Material vinculado com sucesso!';
      this.loading = false;
      this.modalRef.close();
      this.carregaEntidadeCampoPorEspecialidade();
    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });
    this.ausenciaProfissional.periodoInicial = null;
    this.ausenciaProfissional.periodoFinal = null;
    this.ausenciaProfissional.idTipoAusencia = 0;
  }

  carregaDadosDoProfissional() {
    this.carregaEntidadeCampoPorEspecialidade();
  }

  carregaEntidadeCampoPorEspecialidade() {
    this.loading = true;
    this.allItemsEntidadeCampo = [];
    this.service.carregaEntidadeCampoPorEspecialidade(this.object.idEspecialidade).subscribe(result => {
      this.allItemsEntidadeCampo = result;
      this.loading = false;
    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });
  }

  buscaMaterial() {
    this.loading = true;
    let params = '';
    this.allItemsPesquisaMaterial = [];

    if (Util.isEmpty(this.material.descricao) || this.material.descricao.length < 3) {
      this.errors = [{message: 'Informe a descrição do material, ao menos 3 caracteres'}];
      this.loading = false;
      return;
    }

    params = '?descricao=' + this.material.descricao;

    this.service.list('material' + params).subscribe(result => {
      this.allItemsPesquisaMaterial = result;
      this.setPage(1);
      this.loading = false;
      this.errors = [];
    }, erro => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(erro);
    });
  }

  setPage(page: number) {
    this.pager = this.pagerService.getPager(this.allItems.length, page, this.pageLimit);
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  openEntidadeCampo(content: any) {
    this.errors = [];
    this.message = '';
    this.material.descricao = '';
    //this.materialSelecionado = null;
    this.allItemsPesquisaMaterial = [];

    this.modalRef = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'lg'
    });
  }

  disableMaterialButton() {
    return Util.isEmpty(this.materialSelecionado);
  }

  selecionaMaterial(item) {
    this.materialSelecionado = item;
  }

  openConfirmacao(content: any, id: number) {
    this.idEspecialidadeEntidadeCampoExclusao = id;
    this.modalRef = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: 'lg'
    });
  }

  removeEntidadeCampo() {
    this.service.removeEntidadeCampo(this.idEspecialidadeEntidadeCampoExclusao).subscribe(result => {
      this.message = 'Campo removido com sucesso!';
      this.loading = false;
      this.carregaEntidadeCampoPorEspecialidade();
      if (this.modalRef) {
      this.modalRef.close();
      }
    });
  }

  close() {
    this.idEspecialidadeEntidadeCampoExclusao = null;
    if (this.modalRef) {
      this.modalRef.close();
    }
  }
}
