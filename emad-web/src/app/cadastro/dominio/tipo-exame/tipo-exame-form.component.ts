import { Component, OnInit } from '@angular/core';
import { TipoExameService } from './tipo-exame.service';
import { TipoExame } from '../../../_core/_models/TipoExame';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HipoteseDiagnostica } from '../../../_core/_models/HipoteseDiagnostica';
import { Util } from '../../../_core/_util/Util';

@Component({
    selector: 'app-tipo-exame-form',
    templateUrl: './tipo-exame-form.component.html',
    styleUrls: ['./tipo-exame-form.component.css'],
    providers: [TipoExameService]
})

export class TipoExameFormComponent implements OnInit {
  loading: Boolean = false;
  object: TipoExame = new TipoExame();
  method: String = "tipo-exame";
  fields: any[] = [];
  label: String = "Tipo de exame";
  id: number = null;
  domains: any[] = [];
  tipoExameForm: FormGroup;
  groupForm: any = {};
  mensagem: string = "";
  warning: string = "";
  tipoExame: TipoExame = new TipoExame();  
  modalRef: NgbModalRef = null;
  message: string = "";
  errors: any[] = [];
  hipoteseDiagnostica: HipoteseDiagnostica = new HipoteseDiagnostica();
  allItemsHipotese: any[] = [];
  allItemsPesquisaHipoteseDiagnostica: any[] = null;

  //PAGINATION
  pager: any = {};
  pagedItems: any[];
  pageLimit: number = 10;
  paging: any = {
    offset: 0,
    limit: 10,
    total: 0
  };
  totalPages: Number;

  constructor(
    private fb: FormBuilder,
    private service: TipoExameService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router) {
      this.fields = service.fields;
    }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.loading = true;
        this.service.buscaPorId(this.id).subscribe(
          res => {
            this.tipoExame = res;
            this.loading = false;
          }, erro => {
            this.loading = false;
          let json = erro;
          this.warning = "";
          for (var key in json) {
            this.warning += "-" + json[key].msg + '\n';
          }
        }
        );
      }
    });

    this.createGroup();
  }

  cadastrar(event) {
    this.service
      .cadastra(this.tipoExame)
      .subscribe((res: any) => {
        if (res.id) {
          this.router.navigate(['tipos-exames']);
        }
        this.mensagem = "Cadastro efetuado com sucesso!";
        this.warning = "";
        this.tipoExameForm.reset();
      }, erro => {
        let json = erro;
        this.warning = "";
        for (var key in json) {
          this.warning += "-" + json[key].msg + '\n';
        }
      }
    );
  }

  createGroup() {
    this.tipoExameForm = this.fb.group({
      id: [''],
      nome: ['', Validators.required],
      idHipoteseDiagnostica: [null],
      nomeHipoteseDiagnostica: [''],
      situacao: ['', Validators.required]
    });
  }

  openHipotese(content: any) {
    this.errors = [];
    this.message = "";
    this.hipoteseDiagnostica = new HipoteseDiagnostica();
    this.allItemsPesquisaHipoteseDiagnostica = [];

    this.modalRef = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: "lg"
    });
  }
  
  pesquisaHipoteseDiagnostica() {
    this.loading = true;
    let params = "";
    this.allItemsPesquisaHipoteseDiagnostica = [];
    this.errors = [];

    if (Util.isEmpty(this.hipoteseDiagnostica.nome) && Util.isEmpty(this.hipoteseDiagnostica.cid_10))
    {
       this.errors = [{message:"Informe o nome ou código CID 10"}];
       this.loading = false;
       return;
    }

    if (!Util.isEmpty(this.hipoteseDiagnostica.nome))
    {
      if(this.hipoteseDiagnostica.nome.length<3){
       this.errors = [{message:"Informe o nome, ao menos 3 caracteres"}];
       this.loading = false;
       return;
      }
    }

    if (!Util.isEmpty(this.hipoteseDiagnostica.cid_10))
    {
      if (this.hipoteseDiagnostica.cid_10.length < 2)
      { 
        this.errors = [{message:"Informe o código CID 10, ao menos 2 caracteres"}];
        this.loading = false;
        return;
      }
    }

    this.buscaHipoteseDiagnostica();
  }

  buscaHipoteseDiagnostica(offset: Number = null, limit: Number = null) {
    this.loading = true;

    this.paging.offset = offset ? offset : 0;
    this.paging.limit = limit ? limit : 10;    

    var params = "?nome=" + this.hipoteseDiagnostica.nome + "&cid=" + this.hipoteseDiagnostica.cid_10;

    if (this.paging.offset != null && this.paging.limit != null) {
      params += (params == "" ? "?" : "&") + "offset=" + this.paging.offset + "&limit=" + this.paging.limit;
    }    

    this.service.list('hipotese-diagnostica' + params).subscribe(result => {
      this.warning = "";
      this.paging.total = result.total;
      this.totalPages = Math.ceil((this.paging.total / this.paging.limit));
      this.allItemsPesquisaHipoteseDiagnostica = result.items;
      setTimeout(() => {
        this.loading = false;
      }, 300);
    }, erro => {
      setTimeout(() => this.loading = false, 300);
      this.errors = Util.customHTTPResponse(erro);
    });
  }

  selecionaHipoteseDiagnostica(item) {
    this.hipoteseDiagnostica = item;
  }

  close() {
    if (this.modalRef)
      this.modalRef.close();
  }

  disableHipoteseButton() {
    return Util.isEmpty(this.hipoteseDiagnostica.id);
  }

  saveHipotese() {
    this.message = "";
    this.errors = [];
    this.tipoExame.nomeHipoteseDiagnostica = this.hipoteseDiagnostica.cid_10 + ' - ' + this.hipoteseDiagnostica.nome 
    this.tipoExame.idHipoteseDiagnostica = this.hipoteseDiagnostica.id;
    this.close();
  }

  
  loadQuantityPerPagePaginationHipotese(event) {
    let id = parseInt(event.target.value);
    this.paging.limit = id;

    this.setPagePaginedHipotese(this.pager.offset, this.paging.limit);
  }

  setPagePaginedHipotese(offset: number, limit: Number) {
    this.paging.offset = offset !== undefined ? offset : 0;
    this.paging.limit = limit ? limit : this.paging.limit;
    
    this.buscaHipoteseDiagnostica(this.paging.offset, this.paging.limit);
  }
}