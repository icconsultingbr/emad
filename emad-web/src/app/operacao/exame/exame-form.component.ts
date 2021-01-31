import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ExameService } from '../../shared/services/exame.service';
import { Exame } from '../../_core/_models/Exame';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Util } from '../../_core/_util/Util';
import { environment } from '../../../environments/environment';
import { ItemReceita } from '../../_core/_models/ItemReceita';
import { Estoque } from '../../_core/_models/Estoque';
import { Material } from '../../_core/_models/Material';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as uuid from 'uuid';
import { ReciboReceitaImpressaoService } from '../../shared/services/recibo-receita-impressao.service';
import { ItemExame } from '../../_core/_models/ItemExame';
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
  
  object: Exame = new Exame();
  itemExame: ItemExame = new ItemExame();    
  method: string = "exames";
  fields: any[] = [];
  label: string = "Novo exame";
  id: number = null;
  domains: any[] = [];  
  loading: Boolean = false;
  form: FormGroup;
  groupForm: any = {};
  type: string;
  message: string = '';
  warning: string = '';  
  saveLabel: string = "Salvar";    
  errors: any[] = [];  
  modalRef: NgbModalRef = null;  
  listaItensExame: any[] = [];

  constructor(
    private fb: FormBuilder,
    private service: ExameService,
    private route: ActivatedRoute,
    private modalService: NgbModal,   
    private reciboReceitaService: ReciboReceitaImpressaoService, 
    private ref: ChangeDetectorRef,
    private router: Router) {
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
            { id: 1, nome: "Amostra não reagente" },
            { id: 2, nome: "Amostra reagente" },
            { id: 3, nome: "Não realizado" }
          ],           
          resultadoFinal: [
            { id: 1, nome: "Amostra não reagente" },
            { id: 2, nome: "Amostra reagente" },
            { id: 3, nome: "Não realizado" }
          ], 
          
      });      
      if (!Util.isEmpty(this.id)) {
        this.carregaExame();
      }          
    });                            
  });                      
  }      
  
  close(retornaGrid: boolean) {
    if(this.modalRef)
      this.modalRef.close();

    if(retornaGrid)
      this.back();
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
      .inserir(this.object, "exame")
      .subscribe((res: any) => {
        if (this.object.id){
          if(acao == 'F')
            this.openConfirmacao(this.contentRecibo);      
          else
            this.close(true);
        }          
        else{
          this.message = "Exame " + res.id + " criada com sucesso!";
          this.object.id = res.id;
          this.object.situacao = res.situacao;
          this.service.list(`produto-exame/tipo-exame/${this.object.idTipoExame}`).subscribe(produtoExame => {
            this.domains[0].idProdutoExame = produtoExame;                              
            this.object.idTipoExame = this.object.idTipoExame;
          });  
        }          
        
        this.warning = "";
      }, erro => {        
        this.errors = Util.customHTTPResponse(erro);
      });
  }

  carregaExame() {
    this.object.id = this.id;
    this.errors = [];
    this.message = "";
    this.loading = true;
    this.service.findById(this.id, "exame").subscribe(result => {
      this.object = result;  
      this.label = this.object.situacao == '1' ? 'Editar exame' : 'Visualizar exame (Situação: Finalizado)';      
      
      this.service.list(`produto-exame/tipo-exame/${result.idTipoExame}`).subscribe(produtoExame => {
        this.domains[0].idProdutoExame = produtoExame;                              
        this.object.idTipoExame = result.idTipoExame;
      });  

      this.loading = false;
    }, error => {
      this.object = new Exame();      
      this.errors.push({
        message: "Exame não encontrado"
      });
    });
  }

  pacienteSelecionado(object: any){
    this.object.idPaciente = object.id;
  }
 
  toggleItem(){
    return Util.isEmpty(this.itemExame.idProdutoExame) 
    || Util.isEmpty(this.itemExame.idMetodoExame)
    || Util.isEmpty(this.itemExame.resultado);    
  }
  
  openConfirmacao(content: any) {
    this.modalRef = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: "lg"
    });
  }

  removeItemExame(item) {        
    this.object.itensExame = this.object.itensExame.filter(itemExistente => 
                                                    itemExistente.idProdutoExame != item.idProdutoExame);          
  }

  abreReceitaMedica(ano_receita: number, numero_receita: number, unidade_receita: number, retornaGrid: boolean) {
    this.close(retornaGrid);
    this.reciboReceitaService.imprimir(ano_receita, unidade_receita, numero_receita, true);
  }

  createGroup() {
    this.form = this.fb.group({
      id: [''],
      nome: [Validators.required],
      pacienteNome: [Validators.required],
      ano: ['', ''],
      idEstabelecimento: ['', ''],
      idProdutoExame: ['', ''],
      idMetodoExame:['', ''],
      idTipoExame:['', ''],
      resultado: ['', ''],
      resultadoFinal: ['', ''],
      numero: ['', ''],
      dataEmissao: ['', ''],
      situacao: [Validators.required],
      qtdDispensarLote: ['','']
    });
  }
  
  confirmaItem(){    
    if (!this.object.itensExame)
      this.object.itensExame = [];

    this.itemExame.nomeProdutoExame =  this.domains[0].idProdutoExame.filter(item=> item.id == this.itemExame.idProdutoExame)[0].nome;
    this.itemExame.nomeMetodoExame =  this.domains[0].idMetodoExame.filter(item=> item.id == this.itemExame.idMetodoExame)[0].nome;
    this.itemExame.nomeResultado =  this.domains[0].resultado.filter(item=> item.id == this.itemExame.resultado)[0].nome;
    
    this.object.itensExame.push(this.itemExame);
    //this.listaItensExame.push(this.itemExame);
    this.itemExame = new ItemExame();    
    this.ref.detectChanges();
  }

}