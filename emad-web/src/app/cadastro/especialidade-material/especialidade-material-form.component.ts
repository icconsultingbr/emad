import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { NgbModalRef, NgbModal, NgbCalendarIslamicUmalqura } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Util } from '../../_core/_util/Util';
import { Router, ActivatedRoute } from '@angular/router';
import { EspecialidadeMaterialService } from './especialidade-material.service';
import { EspecialidadeMaterial } from '../../_core/_models/EspecialidadeMaterial';
import { AusenciaProfissional } from '../../_core/_models/AusenciaProfissional';
import { Material } from '../../_core/_models/Material';
import { PagerService } from '../../_core/_services/pager.service';

@Component({
  selector: 'app-especialidade-material-form',
  templateUrl: './especialidade-material-form.component.html',
  styleUrls: ['./especialidade-material-form.component.css'],
  providers: [EspecialidadeMaterialService]
})

export class EspecialidadeMaterialFormComponent implements OnInit {
  //MESSAGES
  loading: Boolean = false;
  message: String = "";
  errors: any[] = [];
  modalRef: NgbModalRef = null;
  modalRemoveRef: NgbModalRef = null;
  form: FormGroup;
  method: String = "especialidade-material";
  ausenciaProfissional: AusenciaProfissional = new AusenciaProfissional();
  fields: any[] = [];
  object: EspecialidadeMaterial = new EspecialidadeMaterial();  
  domains: any[] = [];
  allItemsMaterial: any[] = [];
  allItemsPesquisaMaterial: any[] = [];
  material: Material = new Material();
  idEspecialidade: number;
  materialSelecionado: any = null;

  //PAGINATION
  allItems: any[] = [];
  pager: any = {};
  pagedItems: any[];
  pageLimit: number = 10;
  fieldsPacientes: any[] = [];

  constructor(
    private fb: FormBuilder,
    private pagerService: PagerService,
    private service: EspecialidadeMaterialService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router) {
      for (let field of this.service.fields) {
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
        this.carregaMaterialPorEspecialidade();
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
    this.message = "";
    this.errors = [];
    this.loading = true;

    if (!this.materialSelecionado.id)
    {
      this.errors = [{message:"Selecione o material"}];
      this.loading = false;
      return;
    }

    if (!this.object.idEspecialidade)
    {
      this.errors = [{message:"Selecione o material"}];
      this.loading = false;
      return;
    }
    
    this.object.idMaterial = this.materialSelecionado.id;

    this.service.salvaMaterial(this.object).subscribe(result => {
      this.message = "Material vinculado com sucesso!"
      this.loading = false;      
      this.modalRef.close();
      this.carregaMaterialPorEspecialidade();      
    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });    
    this.ausenciaProfissional.periodoInicial = null;
    this.ausenciaProfissional.periodoFinal = null;
    this.ausenciaProfissional.idTipoAusencia = 0;
  }

  carregaDadosDoProfissional()
  {
    this.carregaMaterialPorEspecialidade();
  }
  
  carregaMaterialPorEspecialidade() {
    this.message = "";
    this.errors = [];
    this.loading = true;
    this.allItemsMaterial = [];
    this.service.carregaMaterialPorEspecialidade(this.object.idEspecialidade).subscribe(result => {
      this.allItemsMaterial = result;
      this.loading = false;
    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });
  }

  removeMaterial(item) {
    this.service.removeMaterial(item.id).subscribe(result => {
      this.message = "Material removido com sucesso!"
      this.loading = false;
      this.carregaMaterialPorEspecialidade();
    });
  }

  buscaMaterial() {
    this.loading = true;
    let params = "";
    this.allItemsPesquisaMaterial = [];

    if (Util.isEmpty(this.material.descricao) || this.material.descricao.length<3)
    {
      this.errors = [{message:"Informe a descrição do material, ao menos 3 caracteres"}];
      this.loading = false;
      return;
    }
    
    params = "?descricao=" + this.material.descricao;

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

  openMaterial(content: any) {
    this.errors = [];
    this.message = "";
    this.material.descricao = "";
    //this.materialSelecionado = null;    
    this.allItemsPesquisaMaterial = [];

    this.modalRef = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: "lg"
    });
  }

  disableMaterialButton() {
    return Util.isEmpty(this.materialSelecionado);
  }

  close() {
    this.modalRef.close();
  }

  selecionaMaterial(item) {
    this.materialSelecionado = item;
  }
}