import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ReceitaService } from './receita.service';
import { Receita } from '../../_core/_models/Receita';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Util } from '../../_core/_util/Util';
import { environment } from '../../../environments/environment';
import { ItemReceita } from '../../_core/_models/ItemReceita';
import { Estoque } from '../../_core/_models/Estoque';
import { Material } from '../../_core/_models/Material';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-receita-form',
    templateUrl: './receita-form.component.html',
    styleUrls: ['./receita-form.component.css'],
    providers: [ReceitaService]
})

export class ReceitaFormComponent implements OnInit {
  @ViewChild('contentConfirmacao') contentConfirmacao: ElementRef;
  
  object: Receita = new Receita();
  itemReceita: ItemReceita = new ItemReceita();  
  itemEstoque: Estoque = new Estoque();  
  method: string = "receitas";
  fields: any[] = [];
  label: string = "";
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
  listaMaterialLote: any[] = [];
  listaMaterialLoteDispensado: any[] = [];
  listaMaterialLoteDispensadoGravado: any[] = [];
  listaMaterialLoteDispensadoConfirmar: any[] = [];
  modalRef: NgbModalRef = null;
  
  constructor(
    private fb: FormBuilder,
    private service: ReceitaService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
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

  buscaProfissionais() {
    this.loading = true;
       this.service.list('profissional/estabelecimento/' + JSON.parse(localStorage.getItem("est"))[0].id).subscribe(result => {
        this.domains[0].idProfissional = result;
        this.loading = false;
      }, error => {
        this.loading = false;
        this.errors = Util.customHTTPResponse(error);
      });
  }

  loadDomains() {   
    this.loading = true; 
    this.service.listDomains('estabelecimento').subscribe(estabelecimento => {              
      this.service.listDomains('subgrupo-origem').subscribe(subgrupoOrigem => {              
        this.service.listDomains('uf').subscribe(ufs => {
          this.domains.push({            
            idEstabelecimento: estabelecimento,
            idUf: ufs,
            idMunicipio: [],
            idProfissional: [],                    
            idSubgrupoOrigem: subgrupoOrigem,    
            idPacienteOrigem: [],
            idMandadoJudicial: [],
            idMotivoFimReceita: [],
            idPaciente: []
         });                
              
              this.buscaProfissionais();

              this.service.list('estabelecimento/local/' + JSON.parse(localStorage.getItem("est"))[0].id).subscribe(result => {                        
                if (!Util.isEmpty(this.id)) {
                  this.carregaReceita();
                }
                else
                {
                  this.label = "Nova receita";
                  this.object.idUf = result.idUf;
                  this.object.textoCidade = result.textoCidade;
                  this.service.list(`municipio/uf/${result.idUf}`).subscribe(municipios => {
                    this.domains[0].idMunicipio = municipios;                              
                    this.object.idMunicipio = result.idMunicipio;
                  });
                  this.loading = false;
                }                
              }, error => {
                this.loading = false;
                this.errors = Util.customHTTPResponse(error);
              });
            });                      
          });                      
        });                        
  }      
  
  back() {   
    const route = this.method;                 
    this.router.navigate([route]);
  }

  sendForm(event) {
    this.errors = [];    
    event.preventDefault();

    this.service
      .inserir(this.object, "receita")
      .subscribe((res: any) => {
        if (this.object.id) 
          this.back();
        else
          this.message = "Receita " + res.numero + " criada com sucesso!";

        this.object.id = res.id;
        this.object.numero = res.numero;                
        this.object.situacao = res.situacao;
        this.warning = "";
      }, erro => {        
        this.errors = Util.customHTTPResponse(erro);
      });
  }

  carregaReceita() {
    this.object.id = this.id;
    this.errors = [];
    this.message = "";
    this.loading = true;
    this.service.findById(this.id, "receita").subscribe(result => {
      this.object = result;  
      this.label = this.object.situacao == '1' ? 'Editar receita (Situação: Pendente medicamentos)' : 
                   this.object.situacao == '2' ? 'Completar receita (Situação: Aberta)': 'Visualizar receita (Situação: Finalizada)';
      this.listaMaterialLoteDispensadoConfirmar = this.object.itensReceita;
      this.object.dataEmissao = new Date(this.object.dataEmissao);
      this.service.list(`municipio/uf/${result.idUf}`).subscribe(municipios => {
        this.domains[0].idMunicipio = municipios;                              
        this.object.idMunicipio = result.idMunicipio;
      });      
      this.loading = false;
    }, error => {
      this.object = new Receita();      
      this.errors.push({
        message: "Receita não encontrada"
      });
    });
  }

  pacienteSelecionado(idPaciente: number){
    this.object.idPaciente = idPaciente;
  }

  medicamentoSelecionado(material: any){
    this.itemReceita.idMaterial = material.id;
    this.itemReceita.nomeMaterial = material.descricao;
    this.carregaLotePorMaterial(this.itemReceita.idMaterial);
  } 

  toggleItemReceita(){
    return Util.isEmpty(this.itemReceita.idMaterial) 
    || Util.isEmpty(this.itemReceita.qtdPrescrita)
    || Util.isEmpty(this.itemReceita.tempoTratamento);    
  }

  confirmaItemReceita(){    
    if(this.estoqueContemDivergencias())
      return;

    if (!this.object.itensReceita)
      this.object.itensReceita = [];

    this.listaMaterialLote.forEach(novoItemEstoque => {
      if(novoItemEstoque.qtdDispensar > 0){
        this.itemReceita.itensEstoque.push(novoItemEstoque);  
        this.listaMaterialLoteDispensado.push(novoItemEstoque);
      }        
    });

    if(this.listaMaterialLoteDispensado.length == 0)
    {
      let novoItemEstoque: any = {};
      novoItemEstoque.idMaterial = this.itemReceita.idMaterial
      novoItemEstoque.nomeMaterial = this.itemReceita.nomeMaterial;
      this.listaMaterialLoteDispensado.push(novoItemEstoque);
    }

    this.object.itensReceita.push(this.itemReceita);
    this.itemReceita = new ItemReceita();
    this.listaMaterialLote = [];
  }
  
  carregaLotePorMaterial(idMaterial: number){
    this.loading = true;
    var params = "?idMaterial=" + idMaterial + "&idEstabelecimento=" + JSON.parse(localStorage.getItem("est"))[0].id;;
    this.service.list(`estoque${params}`).subscribe(estoque => {
      this.listaMaterialLote = estoque;                  
      this.loading = false;
    }, erro => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(erro);
    });
  }

  carregaEstoque(item: any){
    this.loading = true;
    this.listaMaterialLoteDispensadoGravado = [];
    this.listaMaterialLoteDispensadoConfirmar.forEach(itemEstoque => {      
      itemEstoque.expandir = (itemEstoque.id == item.id && itemEstoque.expandir == true) ? true : false;
    });

    item.expandir = !item.expandir;
    var params = "?idReceita=" + item.idReceita + "&idItemReceita=" + item.id;
    this.service.list(`receita/item-estoque${params}`).subscribe(estoque => {
      this.listaMaterialLoteDispensadoGravado = estoque;                  
      this.loading = false;
    }, erro => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(erro);
    });
  }

  loadDomainMunicipio($event){
    let id = $event.target.value;
    this.service.list(`municipio/uf/${id}`).subscribe(municipios => {
      this.domains[0].idMunicipio = municipios;                  
    });
  } 

  origemSelecionada($event){
    let id = $event.target.value;
    if(id=="1"){
      this.service.list('estabelecimento/local/' + JSON.parse(localStorage.getItem("est"))[0].id).subscribe(result => {                        
        this.object.idUf = result.idUf;
          this.object.textoCidade = result.textoCidade;
          this.service.list(`municipio/uf/${result.idUf}`).subscribe(municipios => {
            this.domains[0].idMunicipio = municipios;                              
            this.object.idMunicipio = result.idMunicipio;
          });
          this.loading = false;              
      }, error => {
        this.loading = false;
        this.errors = Util.customHTTPResponse(error);
      });
    }
    else
    this.service.list(`municipio/uf/${id}`).subscribe(municipios => {
      this.domains[0].idMunicipio = municipios;                  
    });
  } 

  calculaQtdDispensar()
  {
    if(this.itemReceita.qtdPrescrita && this.itemReceita.tempoTratamento)
    {
      this.itemReceita.qtdDispMes = ((this.itemReceita.qtdPrescrita/this.itemReceita.tempoTratamento)*30);
      this.itemReceita.qtdDispMes = (this.itemReceita.qtdPrescrita<this.itemReceita.qtdDispMes) ? Math.round(this.itemReceita.qtdPrescrita) : this.itemReceita.qtdDispMes;
    }
  }

  estoqueContemDivergencias()
  {
    this.errors = [];   
    var erroQtd = false;
    let somaDispensar: number = 0;
    let listaMaterialLoteExistente = [];
    listaMaterialLoteExistente =  Object.assign([], this.listaMaterialLoteDispensado);

    this.listaMaterialLote.forEach(item => {
      if(item.qtdDispensar > 0 && item.qtdDispensar != "undefined"){
        if(item.qtdDispensar > item.quantidade){
          this.errors.push({
            message: "Quantidade a dispensar por lote é maior que a quantidade existente no lote (" + item.lote + ")"
          });
          erroQtd = true;                
        }
        somaDispensar = somaDispensar + Number(item.qtdDispensar);

        let medicamentoExistente = listaMaterialLoteExistente.filter(itemAdicionado => itemAdicionado.idMaterial == this.itemReceita.idMaterial 
                                                                      && itemAdicionado.lote == item.lote && itemAdicionado.idFabricanteMaterial == item.idFabricanteMaterial);
        if(medicamentoExistente.length > 0)
        {
          this.errors.push({
            message: "O material "+ this.itemReceita.nomeMaterial +" já foi adicionado com o lote (" + item.lote + "). Para alterar a quantidade remova o item e insira novamente."
          });
          erroQtd = true;  
        }
      }
    });

    if(somaDispensar != this.itemReceita.qtdDispMes && (somaDispensar > 0 || this.itemReceita.qtdDispMes > 0)){
      erroQtd = true;        
      this.errors.push({
        message: "A soma dos lotes é diferente da quantidade escolhida para dispensar!"
      });
    }
    return erroQtd;
  }

  openConfirmacao(content: any) {
    this.modalRef = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      size: "sm"
    });
  }

  removeMedicamento(item) {        
    this.listaMaterialLoteDispensado = this.listaMaterialLoteDispensado.filter(itemExistente => itemExistente.id != item.id);
    let limpaItem: boolean = false;

    this.object.itensReceita.forEach(itemReceita => {
      itemReceita.itensEstoque = itemReceita.itensEstoque.filter(itemReceitaExistente => itemReceitaExistente.lote != item.lote);
      if(itemReceita.itensEstoque.length == 0)
        limpaItem = true;
    });
    
    if(limpaItem)
      this.object.itensReceita = this.object.itensReceita.filter(itemExistente => itemExistente.idMaterial != item.idMaterial);    
  }

  createGroup() {
    this.form = this.fb.group({
      id: [''],
      nome: [Validators.required],
      pacienteNome: [Validators.required],
      ano: ['', ''],
      idEstabelecimento: ['', ''],
      numero: ['', ''],
      dataEmissao: ['', ''],
      idSubgrupoOrigem: new FormControl({value: '', disabled: (this.id > 0 || this.object.id > 0) ? true : false}, Validators.required),
      idUf: ['', ''],
      idMunicipio: ['', ''],
      idProfissional: new FormControl({value: '', disabled: (this.id > 0 || this.object.id > 0) ? true : false}, Validators.required),
      textoCidade: ['', ''],
      qtdPrescrita: ['', ''],
      tempoTratamento: ['', ''],
      qtdDispAnterior: ['', ''],
      qtdDispensar: ['', ''],
      qtdDispMes: ['', ''],
      observacoesGerais: ['', ''],
      situacao: [Validators.required],
      qtdDispensarLote: ['','']
    });
  }

}