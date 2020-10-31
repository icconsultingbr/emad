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
import { AtendimentoService } from '../../../operacao/atendimento/atendimento.service';
import { Atendimento, AtendimentoHistorico } from '../../../_core/_models/Atendimento';

@Component({
  selector: 'app-prontuario-paciente-form',
  templateUrl: './prontuario-paciente-form.component.html',
  styleUrls: ['./prontuario-paciente-form.component.css'],
  providers : [PacienteService]
})
export class ProntuarioPacienteFormComponent implements OnInit {
  object: Paciente = new Paciente();
  objectHistorico: Atendimento = new Atendimento();
  pacienteHipotese: PacienteHipotese = new PacienteHipotese();
  method: string = 'paciente';
  fields = [];
  label: string = "Paciente";
  formHistorico: FormGroup;
  formHipotese: FormGroup;
  formMedicamento: FormGroup;
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
  allItemsMedicamentoHistorico: any[] = [];
  allItemsEncaminhamentoHistorico: any[] = [];
  allItemsHipoteseHistorico: any[] = [];
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
  totalPulso: number;
  totalSaturacao: number;
  totalTemperatura: number;
  totalPeso: number;
  pathFiles = `${environment.apiUrl}/fotos/`;

  idHistorico: number;
  dataHistorico: string;
  nomeProfissional: string;
  nomeTipoHistorico: string;
  mostraHistorico: boolean = false;

  @ViewChild('addresstext') addresstext: ElementRef;
 
  public lineChartDataPressaoArterial: Array<any> = [ { data: [] } ];
  public lineChartLabelsPressaoArterial: Array<any> = [];

  public lineChartDataPulso: Array<any> = [ { data: [] } ];
  public lineChartLabelsPulso: Array<any> = [];

  public lineChartDataSaturacao: Array<any> = [ { data: [] } ];
  public lineChartLabelsSaturacao: Array<any> = [];

  public lineChartDataTemperatura: Array<any> = [ { data: [] } ];
  public lineChartLabelsTemperatura: Array<any> = [];

  public lineChartDataPeso: Array<any> = [ { data: [] } ];
  public lineChartLabelsPeso: Array<any> = [];
  
  public pieChartLabels = [];
  public pieChartData = [];

  public lineChartLegend: boolean = false;
  public lineChartType: string = 'line';  

  objectTipoAtendimento: MainChartLine = new MainChartLine();    
  objectAtendimentoSituacao: MainChartLine = new MainChartLine();    
  
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;  
  public barChartDataTipoAtendimento: any[] = [ { data: [], label: '' } ];
  public barChartLabelsTipoAtendimento: string[] = [];
  public barChartDataAtendimentoSituacao: any[] = [ { data: [], label: '' } ];
  public barChartLabelsAtendimentoSituacao: string[] = [];


  constructor(
    private service: PacienteService,
    private atendimentoService: AtendimentoService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private fbHipotese: FormBuilder,
    private fbMedicamento: FormBuilder,
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
                  this.service.listDomains('tipo-ficha').subscribe(tipoFichas => {
                    this.service.listDomains('classificacao-risco').subscribe(classificacaoRiscos => {
                      this.domains.push({
                        idUf: ufs,
                        idNacionalidade: paises,
                        idNaturalidade: [],
                        idMunicipio: [],
                        hipoteses: hipoteseDiagnostica,
                        idEstabelecimentoCadastro: estabelecimentos,
                        tipoFichas: tipoFichas,
                        classificacaoRiscos: classificacaoRiscos,
                        tipoHistoriaClinica: [
                          { id: 1, nome: "Anamnese" },
                          { id: 2, nome: "Evolução" }],
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

  tabSelected(tab: number){
    if(tab == 3){//Sinais vitais
      this.findSinaisVitaisPorPaciente();
    }else if(tab == 4){//Atendimentos
      this.findAtendimentoPorPaciente();
    }else if(tab == 5){//Medicamentos      
      this.findReceitaPorPaciente();
    }else if(tab == 6){//Fichas de atendimentos
      this.findFichasPorPaciente();
    }else if(tab == 7){//Exames
      this.findExamesPorPaciente();
    }else if(tab == 8){//Hipótes diagnosticada
      this.findHipotesePorPaciente();
    }    
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

       this.service.findHipoteseByPacienteAgrupado(this.object.id).subscribe(resultChart => {
        var labels = [];
        for(var itemLabel in resultChart){        
          labels.push(resultChart[itemLabel].label);
        }        
        this.pieChartLabels =  labels;
        var data = [];
        for(var item in resultChart){        
          data.push(resultChart[item].data);
        } 
        this.pieChartData = data;

        this.ref.detectChanges();
        this.loading = false;
     }, error => {
        this.loading = false;
        this.errors = Util.customHTTPResponse(error);
     });

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


  findSinaisVitaisPorPaciente() {
    this.message = "";
    this.errors = [];
    this.loading = true;
    this.lineChartDataPressaoArterial = [ { data: [] }];    
    this.lineChartDataPulso = [ { data: [] }];    
    this.lineChartDataSaturacao = [ { data: [] }];    
    this.lineChartDataTemperatura = [ { data: [] }];    
    this.lineChartDataPeso = [ { data: [] }];    

    this.service.findSinaisVitaisByPaciente(this.object.id, 'pressaoArterial').subscribe(result => {
        this.allItemsSinaisVitaisPressaoArterial = result;
      //  this.totalPressaoArterial = this.allItemsSinaisVitaisPressaoArterial.length;
      //  var labels = [];
      //   for(var item in result){        
      //     labels.push(result[item].label);
      //   } 
      //   this.lineChartLabelsPressaoArterial = labels;  
      //   var data = [];
      //   for(var item in result){        
      //     data.push(result[item].pressaoArterial);
      //   } 
      //   this.lineChartDataPressaoArterial[0].data = data;

       this.service.findSinaisVitaisByPaciente(this.object.id, 'pulso').subscribe(result => {
            this.allItemsSinaisVitaisPulso = result;
            this.totalPulso = this.allItemsSinaisVitaisPulso.length;
            var labels = [];
              for(var item in result){        
                labels.push(result[item].label);
              } 
              this.lineChartLabelsPulso = labels;  
              var data = [];
              for(var item in result){        
                data.push(result[item].pulso);
              } 
              this.lineChartDataPulso[0].data = data;

            this.service.findSinaisVitaisByPaciente(this.object.id, 'saturacao').subscribe(result => {
              this.allItemsSinaisVitaisSaturacao = result;
              this.totalSaturacao = this.allItemsSinaisVitaisSaturacao.length;
              var labels = [];
                for(var item in result){        
                  labels.push(result[item].label);
                } 
                this.lineChartLabelsSaturacao = labels;  
                var data = [];
                for(var item in result){        
                  data.push(result[item].saturacao);
                } 
                this.lineChartDataSaturacao[0].data = data;

              this.service.findSinaisVitaisByPaciente(this.object.id, 'temperatura').subscribe(result => {
                this.allItemsSinaisVitaisTemperatura = result;
                this.totalTemperatura = this.allItemsSinaisVitaisTemperatura.length;
                var labels = [];
                  for(var item in result){        
                    labels.push(result[item].label);
                  } 
                  this.lineChartLabelsTemperatura = labels;  
                  var data = [];
                  for(var item in result){        
                    data.push(result[item].temperatura);
                  } 
                  this.lineChartDataTemperatura[0].data = data;

                this.service.findSinaisVitaisByPaciente(this.object.id, 'peso').subscribe(result => {
                  this.allItemsSinaisVitaisPeso = result;
                  this.totalPeso = this.allItemsSinaisVitaisPeso.length;
                  var labels = [];
                    for(var item in result){        
                      labels.push(result[item].label);
                    } 
                    this.lineChartLabelsPeso = labels;  
                    var data = [];
                    for(var item in result){        
                      data.push(result[item].peso);
                    } 
                    this.lineChartDataPeso[0].data = data;
    
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

  openHistorico(content: any, idAtendimento: number, idHistorico: number) {
    this.createGroupHistorico();
    this.encontraAtendimentoHistorico(idAtendimento, idHistorico);
    this.mostraHistorico = idAtendimento ? false : true;

    this.modalRef = this.modalService.open(content, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      windowClass: 'modal-gg'
    });
  }

  encontraAtendimentoHistorico(idAtendimento: number, idHistorico: number) {
    this.object.id = this.id;
    this.errors = [];
    this.message = "";

    
    if (idAtendimento) {
      this.loading = true; 
      this.atendimentoService.findById(idAtendimento, "atendimento").subscribe(result => {
      this.objectHistorico = result;
      this.objectHistorico.pacienteHistoriaProgressa = result.pacienteHistoriaProgressa;
      this.loading = false;
      this.findHipotesePorAtendimento(idAtendimento);
      this.findEncaminhamentoPorAtendimento(idAtendimento);
      this.findMedicamentoPorAtendimento(idAtendimento);                  
    }, error => {
      this.loading = false;
      this.close();
      this.errors.push({
        message: "Atendimento não encontrado"
      });                                         
    });      
    }
    else{
      this.loading = true; 
      this.atendimentoService.findByHistoricoId(idHistorico).subscribe(result => {
      this.objectHistorico = result;
      this.objectHistorico.pacienteHistoriaProgressa = result.pacienteHistoriaProgressa;
      this.loading = false;

      this.objectHistorico = result;
      this.dataHistorico = result.dataHistorico;
      this.nomeProfissional = result.nomeProfissional;
      this.nomeTipoHistorico = result.nomeTipoHistorico;
      this.objectHistorico.pacienteHistoriaProgressa = result.pacienteHistoriaProgressa;
      this.loading = false;

      this.findHipotesePorAtendimento(idAtendimento);
      this.findEncaminhamentoPorAtendimento(idAtendimento);
      this.findMedicamentoPorAtendimento(idAtendimento);                  
    }, error => {
      this.loading = false;
      this.close();
      this.errors.push({
        message: "Atendimento histórico não encontrado"
      });                                         
    }); 
    }
  }

  disableFields(): boolean {
    if (!this.object) {
      return true;
    } else {
      if (Util.isEmpty(this.objectHistorico.dataFinalizacao) && Util.isEmpty(this.objectHistorico.dataCancelamento)) {
        return false;
      } else {
        return true;
      }
    }
  }

  findHipotesePorAtendimento(idAtendimento: number) {
    this.message = "";
    this.errors = [];
    this.loading = true;
    this.atendimentoService.findHipoteseByAtendimento(idAtendimento).subscribe(result => {
      this.allItemsHipoteseHistorico = result;
      this.loading = false;
    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });
  }
  
  findEncaminhamentoPorAtendimento(idAtendimento: number) {
    this.message = "";
    this.errors = [];
    this.loading = true;
    this.atendimentoService.findEncaminhamentoByAtendimento(idAtendimento).subscribe(result => {
      this.allItemsEncaminhamentoHistorico = result;
      this.loading = false;
    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });
  }

  findMedicamentoPorAtendimento(idAtendimento: number) {
    this.message = "";
    this.errors = [];
    this.loading = true;
    this.atendimentoService.findMedicamentoByAtendimento(idAtendimento).subscribe(result => {
      this.allItemsMedicamentoHistorico = result;
      this.loading = false;
    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });
  }


  createGroupHistorico() {
    this.formHistorico = this.fb.group({
      pacienteHistoriaProgressa: new FormControl({ value: '', disabled: true }),
      pressaoArterial: new FormControl({ value: '', disabled: true }),
      pulso: new FormControl({ value: '', disabled: true }),
      saturacao: new FormControl({ value: '', disabled: true }),
      temperatura: new FormControl({ value: '', disabled: true }),
      altura: new FormControl({ value: '', disabled: true }),
      peso: new FormControl({ value: '', disabled: true }),
      historicoClinico: new FormControl({ value: '', disabled: true }),
      exameFisico: new FormControl({ value: '', disabled: true }),
      observacoesGerais: new FormControl({ value: '', disabled: true }),
      situacao: new FormControl({ value: '', disabled: true }),
      motivoCancelamento: new FormControl({ value: '', disabled: true }),
      tipoFicha: new FormControl({ value: '', disabled: true }),
      idClassificacaoRisco: new FormControl({ value: '', disabled: true }),
      motivoQueixa: new FormControl({ value: '', disabled: true }),
      tipoHistoriaClinica: new FormControl({ value: '', disabled: true }),
    });

    this.formHipotese = this.fbHipotese.group({
      idPaciente: [Validators.required],
      idHipoteseDiagnostica: [Validators.required]
    });

    this.formMedicamento = this.fbMedicamento.group({
      idPaciente: [Validators.required],
      uso: [Validators.required],
      tipoVia: [Validators.required],
      quantidade: [Validators.required],
      apresentacao: [Validators.required],
      posologia: [Validators.required],
    });
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
  public pieChartType = 'pie';

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
  
  abreAtendimentoFichaDigital(id: Number) {
    this.errors = [];
    let url =
      JSON.parse(localStorage.getItem("parametro_seguranca")).filter((url) => url.nome == "URL_FICHA_MEDICA_VISUALIZACAO")
        ?
        JSON.parse(localStorage.getItem("parametro_seguranca")).filter((url) => url.nome == "URL_FICHA_MEDICA_VISUALIZACAO")[0].valor.replace('{id}', id)
        : "";
    this.loading = true;
    this.atendimentoService.openDocument(url).subscribe(result => {
      this.loading = false;
      window.open(
        url,
        '_blank'
      );
    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });
  }
}
