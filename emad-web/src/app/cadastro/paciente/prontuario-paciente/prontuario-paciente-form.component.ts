import { Component, OnInit, ChangeDetectorRef, ViewChild, Output, ElementRef, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { PacienteService } from '.././paciente.service';
import { Paciente } from '../../../_core/_models/Paciente';
import { ActivatedRoute, Router } from '@angular/router';
import { Util } from '../../../_core/_util/Util';
import { environment } from '../../../../environments/environment';
import { PacienteHipotese } from '../../../_core/_models/PacienteHipotese';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ReciboReceitaImpressaoService } from '../../../shared/services/recibo-receita-impressao.service';
import { MainChartLine } from '../../../_core/_models/MainChart';

@Component({
  selector: 'app-prontuario-paciente-form',
  templateUrl: './prontuario-paciente-form.component.html',
  styleUrls: ['./prontuario-paciente-form.component.css'],
  providers : [PacienteService]
})
export class ProntuarioPacienteFormComponent implements OnInit {
  object: Paciente = new Paciente();
  pacienteHipotese: PacienteHipotese = new PacienteHipotese();
  method: string = 'paciente';
  fields = [];
  label: string = "Paciente";
  id: number = null;
  domains: any[] = [];
  form: FormGroup;
  loading: Boolean = false;
  message: string = "";
  errors: any[] = [];
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  allItemsHipotese: any[] = [];
  allItemsAtendimentos: any[] = [];
  allItemsSinaisVitaisPressaoArterial: any[] = [];
  allItemsSinaisVitaisPulso: any[] = [];
  allItemsSinaisVitaisSaturacao: any[] = [];
  allItemsSinaisVitaisTemperatura: any[] = [];
  allItemsSinaisVitaisPeso: any[] = [];  
  allItemsFichas: any[] = [];
  allItemsExames: any[] = [];  
  allItemsReceita: any[] = [];
  listaMaterialLoteDispensadoGravado: any[] = [];
  listaMaterialLoteDispensadoFinalizado: any[] = [];
  virtualDirectory: string = environment.virtualDirectory != "" ? environment.virtualDirectory + "/" : "";
  modalRef: NgbModalRef = null;
  loadPhoto: boolean = false;
  totalPressaoArterial: number;

  @ViewChild('addresstext') addresstext: ElementRef;
 
  objectMedicamento: MainChartLine = new MainChartLine();   

  public lineChartDataMedicamento: Array<any> = [ { data: [] } ];
  public lineChartLabelsMedicamento: Array<any> = [];
  public lineChartLegend: boolean = false;
  public lineChartType: string = 'line';  




    
  objectAtendimento: MainChartLine = new MainChartLine();  
  objectTipoAtendimento: MainChartLine = new MainChartLine();    
  objectAtendimentoSituacao: MainChartLine = new MainChartLine();   

  public lineChartDataAtendimento: Array<any> = [ { data: [] } ];
  public lineChartLabelsAtendimento: Array<any> = [];
  public lineChartDataTipoAtendimento: Array<any> = [ { data: [] } ];
  public lineChartLabelsTipoAtendimento: Array<any> = [];

  constructor(
    private service: PacienteService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private ref: ChangeDetectorRef,
    private modalService: NgbModal,
    private reciboReceitaService: ReciboReceitaImpressaoService,
    private router: Router) {
    this.fields = service.fields;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    this.createGroup();
    this.loadDomains();
  }

  loadDomains() {
    this.loading = true;
    this.service.listDomains('uf').subscribe(ufs => {
      this.service.listDomains('nacionalidade').subscribe(paises => {
        this.service.listDomains('modalidade').subscribe(modalidades => {
          this.service.listDomains('estabelecimento').subscribe(estabelecimentos => {
            this.service.listDomains('raca').subscribe(racas => {
              this.service.listDomains('hipotese-diagnostica').subscribe(hipoteseDiagnostica => {
                this.service.listDomains('atencao-continuada').subscribe(atencaoContinuada => {
                  this.domains.push({
                    idUf: ufs,
                    idNacionalidade: paises,
                    idNaturalidade: [],
                    idMunicipio: [],
                    hipoteses: hipoteseDiagnostica,
                    idEstabelecimentoCadastro: estabelecimentos,
                    escolaridade: [
                      { id: 1, nome: "Educação infantil" },
                      { id: 2, nome: "Fundamental" },
                      { id: 3, nome: "Médio" },
                      { id: 4, nome: "Superior (Graduação)" },
                      { id: 5, nome: "Pós-graduação" },
                      { id: 6, nome: "Mestrado" },
                      { id: 7, nome: "Doutorado" },
                      { id: 8, nome: "Escola" },
                      { id: 9, nome: "Analfabeto" },
                      { id: 10, nome: "Não informado" }
                    ],
                    idModalidade: modalidades,
                    sexo: [
                      { id: "1", nome: "Masculino" },
                      { id: "2", nome: "Feminino" },
                      { id: "3", nome: "Ambos" },
                      { id: "4", nome: "Não informado" }
                    ],
                    idTipoSanguineo: [
                      { id: "1", nome: "A_POSITIVO" },
                      { id: "2", nome: "A_NEGATIVO" },
                      { id: "3", nome: "B_POSITIVO" },
                      { id: "4", nome: "B_NEGATIVO" },
                      { id: "5", nome: "AB_POSITIVO" },
                      { id: "6", nome: "AB_NEGATIVO" },
                      { id: "7", nome: "O_POSITIVO" },
                      { id: "8", nome: "O_NEGATIVO" },
                    ],
                    idRaca: racas,
                    idAtencaoContinuada: atencaoContinuada,
                    gruposAtencaoContinuada: atencaoContinuada,
                  });
                  if (!Util.isEmpty(this.id)) {
                    this.encontraPaciente();
                  }
                  else{
                    this.loading = false;
                    this.loadPhoto = true;
                  }
                });
              });
            });
          });
        });
      });
    });
  }

  encontraPaciente() {
    this.object.id = this.id;
    this.errors = [];
    this.message = "";
    this.loading = true;

    this.service.findById(this.id, this.method).subscribe(result => {
      this.object = result;
      this.loadPhoto = true;
      this.loading = false;
      this.carregaNaturalidade();
      this.findHipotesePorPaciente();
      this.findAtendimentoPorPaciente();
      this.findSinaisVitaisPorPaciente();
      this.carregaDashboardAtendimento(null);
      this.findFichasPorPaciente();
      this.findExamesPorPaciente();
      this.findReceitaPorPaciente();
    }, error => {
      this.object = new Paciente();
      this.loadPhoto = true;
      this.loading = false;      ;
      this.allItemsHipotese = [];
      this.errors.push({
        message: "Paciente não encontrado"
      });
    });
  }

  tabSelected(e: any){
    console.log('teste tab');
    
    this.errors.push({
      message: "Paciente não encontrado"
    });
  }

  carregaNaturalidade() {
    this.loading = true;
    this.service.carregaNaturalidadePorNacionalidade(this.object.idNacionalidade).subscribe(result => {
      this.domains[0].idNaturalidade = result;
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }

  back() {
    const route = "pacientes";
    this.router.navigate([route]);
  }

  createGroup() {
    this.form = this.fb.group({
      id: [''],
      cartaoSus: ['',''],
      nome: ['', Validators.required],
      nomeSocial: ['', ''],
      apelido: ['', ''],
      nomeMae: ['', Validators.required],
      nomePai: ['', ''],
      dataNascimento: ['', Validators.required],
      sexo: new FormControl({value: '', disabled: true}),
      idNacionalidade: new FormControl({value: '', disabled: true}),
      idNaturalidade: new FormControl({value: '', disabled: true}),
      ocupacao: ['', ''],
      cpf: ['', ''],
      rg: ['', ''],
      dataEmissao: ['', ''],
      orgaoEmissor: ['', ''],
      escolaridade: new FormControl({value: '', disabled: true}),
      cep: ['', ''],
      logradouro: ['', ''],
      numero: ['', ''],
      complemento: ['', ''],
      bairro: ['', ''],
      idMunicipio: ['', ''],
      idUf: ['', ''],
      foneResidencial: ['', ''],
      foneCelular: ['', ''],
      foneContato: ['', ''],
      contato: ['', ''],
      email: ['', ''],
      idModalidade: ['', ''],
      latitude: ['', ''],
      longitude: ['', ''],
      idSap: ['', ''],
      idTipoSanguineo: ['', ''],
      idRaca: ['', ''],
      numeroProntuario: ['', ''],
      numeroProntuarioCnes: ['', ''],
      idAtencaoContinuada: ['', ''],
      historiaProgressaFamiliar: ['', ''],
      observacao: ['', ''],
      idEstabelecimentoCadastro: new FormControl({value: '', disabled: (this.id > 0 || this.object.id > 0) ? true : false}, Validators.required),
      gruposAtencaoContinuada: ['', ''],
      falecido: new FormControl({value: '', disabled: true}),
      situacao: new FormControl({value: '', disabled: true}),
    });
  }

  findHipotesePorPaciente() {
    this.message = "";
    this.errors = [];
    this.loading = true;
    this.service.findHipoteseByPaciente(this.object.id).subscribe(result => {
       this.allItemsHipotese = result;
       this.loading = false;
    }, error => {
       this.loading = false;
       this.errors = Util.customHTTPResponse(error);
    });
  }

  findAtendimentoPorPaciente() {
    this.message = "";
    this.errors = [];
    this.loading = true;
    this.service.findAtendimentoByPaciente(this.object.id, 1).subscribe(result => {
       this.allItemsAtendimentos = result;
       this.loading = false;
    }, error => {
       this.loading = false;
       this.errors = Util.customHTTPResponse(error);
    });
  }

  carregaDashboardAtendimento(item) {    
    this.loading = true;
    this.objectAtendimento.periodo = item ? item.id : 7;    
    this.objectAtendimento.periodoNome = item ? item.nome : 'Últimos 7 dias';    
    this.lineChartDataAtendimento = [ { data: [] }];    

    this.objectAtendimento.qtdTotal = 3;
    this.objectTipoAtendimento.qtdTotal = 2;

    this.service.findSinaisVitaisByPaciente(this.object.id, 'pressaoArterial').subscribe(result => {                    
      var labels = [];
      for(var item in result){        
        labels.push(result[item].label);
      } 
      this.lineChartLabelsAtendimento = labels;

      var data = [];
      for(var item in result){        
        data.push(result[item].pressaoArterial);
      } 
      this.lineChartDataAtendimento[0].data = data;
      this.loading = false;
    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    }); 
  }


  findSinaisVitaisPorPaciente() {
    this.message = "";
    this.errors = [];
    this.loading = true;
    this.lineChartDataMedicamento = [ { data: [] }];    

    this.service.findSinaisVitaisByPaciente(this.object.id, 'pressaoArterial').subscribe(result => {
       this.allItemsSinaisVitaisPressaoArterial = result;

       this.totalPressaoArterial = this.allItemsSinaisVitaisPressaoArterial.length;

       var labels = [];
        for(var item in result){        
          labels.push(result[item].label);
        } 
        this.lineChartLabelsMedicamento = labels;
  
        var data = [];
        for(var item in result){        
          data.push(result[item].pressaoArterial);
        } 
        this.lineChartDataMedicamento[0].data = data;


       this.service.findSinaisVitaisByPaciente(this.object.id, 'pulso').subscribe(result => {
            this.allItemsSinaisVitaisPulso = result;

            this.service.findSinaisVitaisByPaciente(this.object.id, 'saturacao').subscribe(result => {
              this.allItemsSinaisVitaisSaturacao = result;

              this.service.findSinaisVitaisByPaciente(this.object.id, 'temperatura').subscribe(result => {
                this.allItemsSinaisVitaisTemperatura = result;

                this.service.findSinaisVitaisByPaciente(this.object.id, 'peso').subscribe(result => {
                  this.allItemsSinaisVitaisPeso = result;
    
              }, error => {
                  this.loading = false;
                  this.errors = Util.customHTTPResponse(error);
              });
  
            }, error => {
                this.loading = false;
                this.errors = Util.customHTTPResponse(error);
            });

          }, error => {
              this.loading = false;
              this.errors = Util.customHTTPResponse(error);
          });

        }, error => {
            this.loading = false;
            this.errors = Util.customHTTPResponse(error);
        });

    }, error => {
       this.loading = false;
       this.errors = Util.customHTTPResponse(error);
    });
  }  

  findFichasPorPaciente() {
    this.message = "";
    this.errors = [];
    this.loading = true;
    this.service.findAtendimentoByPaciente(this.object.id, 2).subscribe(result => {
       this.allItemsFichas = result;
       this.loading = false;
    }, error => {
       this.loading = false;
       this.errors = Util.customHTTPResponse(error);
    });
  }

  findExamesPorPaciente() {
    this.message = "";
    this.errors = [];
    this.loading = true;
    this.service.findAtendimentoByPaciente(this.object.id, 3).subscribe(result => {
       this.allItemsExames = result;
       this.loading = false;
    }, error => {
       this.loading = false;
       this.errors = Util.customHTTPResponse(error);
    });
  }

  findReceitaPorPaciente() {
    this.message = "";
    this.errors = [];
    this.loading = true;
    this.service.findReceitaByPaciente(this.object.id).subscribe(result => {
       this.allItemsReceita = result;
       this.loading = false;
    }, error => {
       this.loading = false;
       this.errors = Util.customHTTPResponse(error);
    });
  }

  visualizaAtendimentos(id : any) : void {
    let url = this.router.url.replace('paciente','') + this.virtualDirectory + "#/atendimentos/cadastro/" + id;
    this.service.file('atendimento/consulta-por-paciente', url).subscribe(result=>{
      this.loading = false;
      window.open(
        url,
        '_blank'
      );
    });
  }

  carregaEstoque(item: any){
    this.loading = true;
    this.listaMaterialLoteDispensadoGravado = [];
    this.listaMaterialLoteDispensadoFinalizado.forEach(itemEstoque => {
      itemEstoque.expandir = (itemEstoque.id == item.id && itemEstoque.expandir == true) ? true : false;
    });

    item.expandir = !item.expandir;
    this.service.list(`item-receita/receita/` + item.id).subscribe(estoque => {
      this.listaMaterialLoteDispensadoGravado = estoque;
      this.loading = false;
    }, erro => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(erro);
    });
  }

  close() {
    if(this.modalRef)
      this.modalRef.close();
  }

  abreReceitaMedica(ano_receita: number, numero_receita: number, unidade_receita: number) {
    this.reciboReceitaService.imprimir(ano_receita, unidade_receita, numero_receita, true);
  }

  public lineChartOptions: any = {
    responsive: true,
    layout: {
      padding: {
        left: 5,
        right: 5,
        top: 0,
        bottom: 3
      }
    },
    legend: {
      display: false,
      labels: {
        display: false
      }
    },
    title: {
      display: false,
      text: 'Custom Chart Title'
    },
    scales: {
      xAxes: [{
        display: false
      }],
      yAxes: [{
        display: false
      }]
    }
  };

  public lineChartColors: Array<any> = this.renderBgChart('rgba(0, 0, 0, 0)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)', '#fff', '#B4B4B4', 'rgba(255,255,255,0.8)');
  public lineChartColors2: Array<any> = this.renderBgChart('rgba(0, 0, 0, 0)', 'rgba(219,219,219,1)', 'rgba(219,219,219,1)', '#00929c', 'rgb(77, 111, 160,1)', 'rgba(46,79,143,0.8)');
  
  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  public renderBgChart(bg, border, pointBg, pointBorder, pointHoverBg, pointHoverBorder) {
    let lineChartColors: Array<any> = [
      { // grey
        backgroundColor: bg ? bg : 'rgba(0, 0, 0, 0)',
        borderColor: border ? border : 'rgba(255,255,255,0.2)',
        pointBackgroundColor: pointBg ? pointBg : 'rgba(255,255,255,1)',
        pointBorderColor: pointBorder ? pointBorder : '#fff',
        pointHoverBackgroundColor: pointHoverBg ? pointHoverBg : '#fff',
        pointHoverBorderColor: pointHoverBorder ? pointHoverBorder : 'rgba(255,255,255,0.8)'
      }
    ];

    return lineChartColors;
  }
}
