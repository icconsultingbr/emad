import { Component, OnInit } from '@angular/core';
import { ReceitaService } from './receita.service';
import { Receita } from '../../_core/_models/Receita';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Util } from '../../_core/_util/Util';
import { environment } from '../../../environments/environment';
import { ItemReceita } from '../../_core/_models/ItemReceita';
import { Estoque } from '../../_core/_models/Estoque';
import { Material } from '../../_core/_models/Material';

@Component({
    selector: 'app-receita-form',
    templateUrl: './receita-form.component.html',
    styleUrls: ['./receita-form.component.css'],
    providers: [ReceitaService]
})

export class ReceitaFormComponent implements OnInit {

  object: Receita = new Receita();
  itemReceita: ItemReceita = new ItemReceita();  
  itemEstoque: Estoque = new Estoque();  
  method: string = "receitas";
  fields: any[] = [];
  label: string = "Receita";
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
  listaMaterialLoteDispensadoConfirmar: any[] = [];

  constructor(
    private fb: FormBuilder,
    private service: ReceitaService,
    private route: ActivatedRoute,
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

    if(this.object.id)
      this.object.situacao = "2"; //Aberta
    else
      this.object.situacao = "1"; //Pendente medicamentos

    this.service
      .inserir(this.object, "receita")
      .subscribe((res: any) => {
        if (this.object.id) 
          this.back();
        else
          this.message = "Receita " + res.numero + " criada com sucesso!";

        this.object.id = res.id;
        this.object.numero = res.numero;                
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
      this.itemReceita.qtdDispensar = ((this.itemReceita.qtdPrescrita/this.itemReceita.tempoTratamento)*30);
      this.itemReceita.qtdDispensar = (this.itemReceita.qtdPrescrita<this.itemReceita.qtdDispensar) ? Math.round(this.itemReceita.qtdPrescrita) : this.itemReceita.qtdDispensar;
    }
  }

  estoqueContemDivergencias()
  {
    this.errors = [];   
    var erroQtd = false;
    let somaDispensar: number = 0;
    this.listaMaterialLote.forEach(item => {
      if(item.qtdDispensar > 0 && item.qtdDispensar != "undefined"){
        if(item.qtdDispensar > item.quantidade){
          this.errors.push({
            message: "Quantidade a dispensar por lote é maior que a quantidade existente no lote (" + item.lote + ")"
          });
          erroQtd = true;                
        }
        somaDispensar = somaDispensar + Number(item.qtdDispensar);
      }
    });

    if(somaDispensar != this.itemReceita.qtdDispensar){
      erroQtd = true;        
      this.errors.push({
        message: "A soma dos lotes é diferente da quantidade escolhida para dispensar!"
      });
    }
    return erroQtd;
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
      observacoesGerais: ['', ''],
      situacao: [Validators.required],
      qtdDispensarLote: ['','']
    });
  }

}