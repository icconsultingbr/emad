import { Component, Input, OnInit, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Util } from '../../_core/_util/Util';
import { PesquisaMedicamentoService } from './pesquisa-medicamento.service';
import { AppFormService } from '../../_core/_components/app-form/app-form.service';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { PagerService } from '../../_core/_services/pager.service';
import { Paciente } from '../../_core/_models/Paciente';
import { ItemReceita } from '../../_core/_models/ItemReceita';
import { Material } from '../../_core/_models/Material';

@Component({
  selector: 'app-pesquisa-medicamento',  
  templateUrl: './pesquisa-medicamento.component.html',
  styleUrls: ['./pesquisa-medicamento.component.css']
})

export class PesquisaMedicamentoComponent implements OnInit, AfterViewInit {
  @Output() medicamentoSelecionadoEvent = new EventEmitter<any>();  
  @Input() medicamentoClearEvent = new EventEmitter<any>();  
  @Input() idProfissional: number;  
  @Input() idMaterial: number;  
  @Input() object: Material = new Material();
  loading: Boolean = false;
  modalRef: NgbModalRef = null;
  service: PesquisaMedicamentoService;
  form: FormGroup;
  groupForm: any = {};
  type: string;
  
  id: any;
  errors: any[] = [];
  materialSelecionado: any = null;
  listaMedicamentos: any[] = [];
  domains: any[] = [];

  //PAGINATION
  allItems: any[] = [];
  pager: any = {};
  pagedItems: any[];
  pageLimit: number = 10;
  fieldsPacientes: any[] = [];
  
  setPage(page: number) {
    this.pager = this.pagerService.getPager(this.allItems.length, page, this.pageLimit);
    this.pagedItems = this.allItems.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }

  loadQuantityPerPage(event) {
    let id = parseInt(event.target.value);
    this.pageLimit = id;
    this.setPage(1);
  }

  constructor(
    private fb: FormBuilder,
    router: Router,
    service: AppFormService,
    route: ActivatedRoute,
    private pagerService: PagerService,
    private modalService: NgbModal
  ) {
    this.service = service;
  }  

  ngOnInit() {
    this.createGroup();  
    this.loadDomains(); 
    if(this.id)
    { 
      this.object.id = this.idMaterial;
    }
  }

  createGroup() {
    this.form = this.fb.group({
      id: [''],
      nome: [Validators.required]
    });
  }

  loadDomains() {
    this.loading = true;
    this.service.listDomains('grupo-material').subscribe(grupoMaterial => {
      this.domains.push({
        idGrupoMaterial: grupoMaterial,
      });
      this.loading = false;
    });
  }

  open(content: any) {
    this.clear();
    this.modalRef = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: "lg"
    });
  }

  ngAfterViewInit() {
  }

  close() {
    this.modalRef.close();
  } 

  clear() {
    this.object = new Material();
    this.materialSelecionado = null;    
    this.listaMedicamentos = [];
  }

  toggleMedicamento() {
    return Util.isEmpty(this.materialSelecionado);
  }

  selecionaMedicamento(item) {
    this.materialSelecionado = item;
  }

  confirmaMedicamento() {
    this.object = this.materialSelecionado;        
    this.medicamentoSelecionadoEvent.emit(this.object);
    this.close();
  }

  buscaMedicamento() {
    this.loading = true;
    let params = "";
    this.listaMedicamentos = [];

    if (Util.isEmpty(this.object.descricao) || this.object.descricao.length<3)
    {
       this.errors = [{message:"Informe a descrição do medicamento, ao menos 3 caracteres"}];
       this.loading = false;
       return;
    }

    if (Util.isEmpty(this.idProfissional))
    {
       this.errors = [{message:"Selecione o profissional antes de pesquisar um medicamento"}];
       this.loading = false;
       return;
    }
    
    params = "?descricao=" + this.object.descricao + "&idGrupoMaterial=" + this.object.idGrupoMaterial;

    this.service.list('material/especialidade/' + this.idProfissional + params).subscribe(result => {
      this.listaMedicamentos = result;
      this.setPage(1);
      this.loading = false;
      this.errors = [];
    }, erro => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(erro);
    });
  }
}

