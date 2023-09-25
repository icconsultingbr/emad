import { Component, OnInit } from '@angular/core';
import { BloqueioLoteService } from './bloqueio-lote.service';
import { Estoque } from '../../../_core/_models/Estoque';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Util } from '../../../_core/_util/Util';
import { Material } from '../../../_core/_models/Material';

@Component({
    selector: 'app-bloqueio-lote-form',
    templateUrl: './bloqueio-lote-form.component.html',
    styleUrls: ['./bloqueio-lote-form.component.css'],
    providers: [BloqueioLoteService]
})

export class BloqueioLoteFormComponent implements OnInit {

  object: Estoque = new Estoque();
  method: String = 'estoque';
  fields: any[] = [];
  label: String = 'Estoque';
  id: number = null;
  domains: any[] = [];
  loading: Boolean = false;
  message = '';
  errors: any[] = [];
  form: FormGroup;
  objectMaterial: Material = new Material();

  constructor(
    private fb: FormBuilder,
    private service: BloqueioLoteService,
    private route: ActivatedRoute,
    private router: Router) {
      this.fields = service.fields;
    }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];

      if (this.id) {
        this.service.buscaPorId(this.id).subscribe(
          res => {
            this.object = res;
          }
        );
      }
    });
    this.createGroup();
    this.domains.push({
      idLoteAtual: []
     });
  }

  createGroup() {
    this.form = this.fb.group({
      id: [''],
      idTipoMovimento: ['', ''],
      nomeMaterial: ['', ''],
      idFabricante: ['', ''],
      idEstabelecimento: ['', ''],
      numeroEmpenho: ['', ''],
      validade: ['', ''],
      numeroDocumento: ['', ''],
      quantidade: ['', ''],
      idLoteAtual: ['', ''],
      lote: ['', ''],
      bloqueado: ['', ''],
      motivoBloqueio: ['', ''],
    });
  }

  back() {
    this.router.navigate(['bloqueio-lote']);
  }

  toggleItemEntradaMaterial() {
    return Util.isEmpty(this.object.idMaterial)
    || Util.isEmpty(this.object.lote)
    || Util.isEmpty(this.object.quantidade);
  }

  medicamentoSelecionado(material: any) {
    this.object.idMaterial = material.id;
    this.object.nomeMaterial = material.descricao;
    this.buscaLotes();
  }

  buscaLotes() {
    this.loading = true;
       this.service.list('estoque/material-lote/'
       + this.object.idMaterial
        + '/estabelecimento/'
        +  JSON.parse(localStorage.getItem('est'))[0].id
        + '?loteBloqueado=' + '0'
        + '&operacao='  + '2').subscribe(result => {
        this.domains[0].idLoteAtual = result;
        this.object.lote = null;
        this.loading = false;
      }, error => {
        this.loading = false;
        this.errors = Util.customHTTPResponse(error);
      });
  }


  loteSelecionado(lote: any) {
    let loteSelecionado: any = {};
    loteSelecionado = this.domains[0].idLoteAtual[lote.target.options.selectedIndex - 1];
    this.object.quantidade = loteSelecionado.quantidade;
    this.object.id = loteSelecionado.id;
  }

  sendForm(event) {
    this.errors = [];
    event.preventDefault();

    if (this.object.motivoBloqueio.length > 0 && !this.object.bloqueado) {
      this.errors.push({
        message: 'Favor marcar a opção Bloqueado, ou limpe o campo Motivo bloqueio'
      });
      return;
    }

    this.service
       .bloquearLote(this.object)
       .subscribe((res: any) => {
         this.back();
       }, erro => {
         this.errors = Util.customHTTPResponse(erro);
       });
  }
}
