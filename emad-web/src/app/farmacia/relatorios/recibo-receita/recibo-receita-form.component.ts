import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ReceitaService } from '../../../shared/services/receita.service';
import { Receita } from '../../../_core/_models/Receita';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Util } from '../../../_core/_util/Util';
import { ItemReceita } from '../../../_core/_models/ItemReceita';
import { Estoque } from '../../../_core/_models/Estoque';
import * as uuid from 'uuid';
import { ReciboReceitaImpressaoService } from '../../../shared/services/recibo-receita-impressao.service';
const myId = uuid.v4();

@Component({
    selector: 'app-recibo-receita-form',
    templateUrl: './recibo-receita-form.component.html',
    styleUrls: ['./recibo-receita-form.component.css'],
    providers: [ReceitaService]
})

export class ReciboReceitaFormComponent implements OnInit {
  object: Receita = new Receita();
  itemReceita: ItemReceita = new ItemReceita();
  itemEstoque: Estoque = new Estoque();
  method = 'receitas';
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

  constructor(
    private fb: FormBuilder,
    private service: ReceitaService,
    private reciboReceitaService: ReciboReceitaImpressaoService, ) {
      this.fields = service.fields;
    }

  ngOnInit() {
    this.createGroup();
    this.loadDomains();
  }

  loadDomains() {
    this.service.listDomains('estabelecimento').subscribe(estabelecimentos => {
      this.domains.push({
        idEstabelecimento: estabelecimentos,
      });
    });
  }

  abreReceitaMedica() {
    this.errors = [];

    if (!this.object.ano || !this.object.idEstabelecimento || !this.object.numero) {
      this.errors.push({
        message: 'Preencha os campos obrigatórios'
      });
      return;
    }

    this.service.obterRelatorio(this.object.ano, this.object.idEstabelecimento, this.object.numero).subscribe(result => {
      if (!result) {
        this.errors.push({
          message: 'Receita não encontrada'
        });
        return;
      }
    }, error => {
      this.errors = Util.customHTTPResponse(error);
    });

    this.reciboReceitaService.imprimir(this.object.ano, this.object.idEstabelecimento, this.object.numero, true);
  }

  createGroup() {
    this.form = this.fb.group({
      ano: ['', Validators.required],
      idEstabelecimento: ['', Validators.required],
      numero: [Validators.required],
    });
  }
}
