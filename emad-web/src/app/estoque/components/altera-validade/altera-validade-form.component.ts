import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AlteraValidadeService } from './altera-validade.service';
import { Estoque } from '../../../_core/_models/Estoque';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MovimentoGeral, ItemMovimentoGeral } from '../../../_core/_models/MovimentoGeral';
import { Util } from '../../../_core/_util/Util';
import { Material } from '../../../_core/_models/Material';

@Component({
    selector: 'app-altera-validade-form',
    templateUrl: './altera-validade-form.component.html',
    styleUrls: ['./altera-validade-form.component.css'],
    providers: [AlteraValidadeService]
})

export class AlteraValidadeFormComponent implements OnInit {

  object: Estoque = new Estoque();
  method: String = "estoque";
  fields: any[] = [];
  label: String = "Estoque";
  id: number = null;
  domains: any[] = [];
  loading: Boolean = false;
  message: string = '';
  errors: any[] = [];      
  form: FormGroup;
  objectMaterial: Material = new Material();

  constructor(
    private fb: FormBuilder,
    private service: AlteraValidadeService,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private router: Router) {
      this.fields = service.fields;
    }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
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

  toggleItemEntradaMaterial(){
    return Util.isEmpty(this.object.idMaterial)     
    || Util.isEmpty(this.object.lote)
    || Util.isEmpty(this.object.validade);    
  }

  medicamentoSelecionado(material: any){
    this.object.idMaterial = material.id;
    this.object.nomeMaterial = material.descricao;        
    this.buscaLotes();
  } 

  buscaLotes() {
    this.loading = true;
       this.service.list('estoque/material-lote/' 
       + this.object.idMaterial
        + '/estabelecimento/' 
        +  JSON.parse(localStorage.getItem("est"))[0].id 
        + "?loteBloqueado=" + "0"        
        + "&operacao="  + "2").subscribe(result => {
        this.domains[0].idLoteAtual = result;
        this.object.lote = null;
        this.loading = false;
      }, error => {
        this.loading = false;
        this.errors = Util.customHTTPResponse(error);
      });
  }

  
  loteSelecionado(lote: any){
    var loteSelecionado: any = {};
    loteSelecionado = this.domains[0].idLoteAtual[lote.target.options.selectedIndex-1];    
    this.object.id = loteSelecionado.id;
  }   

  sendForm(event) {
    this.errors = [];    
    event.preventDefault();
    
    if(!this.object.validade){
      this.errors.push({
        message: "Favor informar a validade"
      });      
      return;
    }   

    this.service
       .alterarValidade(this.object)
       .subscribe((res: any) => {
         this.object = new Estoque();
         this.objectMaterial = new Material();
         this.ref.detectChanges(); 
       }, erro => {        
         this.errors = Util.customHTTPResponse(erro);
       });
  }
}