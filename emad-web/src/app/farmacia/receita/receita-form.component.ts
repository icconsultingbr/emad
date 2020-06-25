import { Component, OnInit } from '@angular/core';
import { ReceitaService } from './receita.service';
import { Receita } from '../../_core/_models/Receita';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Util } from '../../_core/_util/Util';

@Component({
    selector: 'app-receita-form',
    templateUrl: './receita-form.component.html',
    styleUrls: ['./receita-form.component.css'],
    providers: [ReceitaService]
})

export class ReceitaFormComponent implements OnInit {

  object: Receita = new Receita();
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

  loadDomains() {    
    this.service.listDomains('estabelecimento').subscribe(estabelecimento => {      
        this.service.listDomains('profissional').subscribe(profissional => {          
            this.service.listDomains('subgrupo-origem').subscribe(subgrupoOrigem => {              
                this.service.listDomains('uf').subscribe(ufs => {
                  this.domains.push({            
                    idEstabelecimento: estabelecimento,
                    idUf: ufs,
                    idMunicipio: [],
                    idProfissional: profissional,                    
                    idSubgrupoOrigem: subgrupoOrigem,    
                    idPacienteOrigem: [],
                    idMandadoJudicial: [],
                    idMotivoFimReceita: [],
                    idPaciente: []
              });                
              
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

    var dateInicialFormatada;
    var dataAntiga = this.form.value.dataEmissao;

    if (Util.isEmpty(this.form.value.dataEmissao))
    {
      this.errors = [{message:"Data de emissão é um campo obrigatório"}];
      this.loading = false;
      return;
    }

    dateInicialFormatada = this.form.value.dataEmissao.getFullYear() + "-" + this.twoDigits(1 + this.form.value.dataEmissao.getMonth()) + "-" +
    this.twoDigits(this.form.value.dataEmissao.getDate()) + " " + 
    this.twoDigits(this.form.value.dataEmissao.getHours()) + ":" + 
    this.twoDigits(this.form.value.dataEmissao.getMinutes()) + ":" + 
    this.twoDigits(this.form.value.dataEmissao.getSeconds());

    this.object.dataEmissao = dateInicialFormatada;    
    this.object.situacao = "1";

    this.service
      .inserir(this.object, "receita")
      .subscribe((res: any) => {
        if (this.form.value.id) 
          this.message = "Alteração efetuada com sucesso!";
        else
          this.message = "Receita " + res.numero + " criada com sucesso!";

        this.object.id = res.id;
        this.object.numero = res.numero;        
        this.object.dataEmissao = dataAntiga;
        this.warning = "";
      }, erro => {        
        this.errors = Util.customHTTPResponse(erro);
      });
  }

  twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
  }

  pacienteSelecionado(idPaciente: number){
    this.object.idPaciente = idPaciente;
  }
  
  loadDomainMunicipio($event){
    let id = $event.target.value;
    this.service.list(`municipio/uf/${id}`).subscribe(municipios => {
      this.domains[0].idMunicipio = municipios;                  
    });
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
      idSubgrupoOrigem: ['', ''],
      idUf: ['', ''],
      idMunicipio: ['', ''],
      idProfissional: ['', ''],
      textoCidade: ['', ''],
      observacoesGerais: ['', ''],
      situacao: [Validators.required],
      motivoCancelamento: ['',''],      
      tipoFicha: [Validators.required],
      idClassificacaoRisco: [Validators.required],
      motivoQueixa: ['','']
    });
  }

}