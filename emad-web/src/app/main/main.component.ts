import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { AppNavbarService } from '../_core/_components/app-navbar/app-navbar.service';
import { MainChartLine } from '../_core/_models/MainChart';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Util } from '../_core/_util/Util';
import { MainService } from './main.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  providers: [MainService]
})

export class MainComponent implements OnInit {

  objectAtendimento: MainChartLine = new MainChartLine();
  objectMedicamento: MainChartLine = new MainChartLine();
  objectTipoAtendimento: MainChartLine = new MainChartLine();
  objectAtendimentoSituacao: MainChartLine = new MainChartLine();
  method = 'profissional';
  fields = [];
  label = 'Profissional';
  id: Number = null;
  domains: any[] = [];
  loading: Boolean = false;
  errors: any[] = [];
  dash: Boolean = false;
  form: FormGroup;

  public lineChartDataAtendimento: Array<any> = [ { data: [] } ];
  public lineChartLabelsAtendimento: Array<any> = [];
  public lineChartDataMedicamento: Array<any> = [ { data: [] } ];
  public lineChartLabelsMedicamento: Array<any> = [];
  public lineChartDataTipoAtendimento: Array<any> = [ { data: [] } ];
  public lineChartLabelsTipoAtendimento: Array<any> = [];
  public lineChartLegend = false;
  public lineChartType = 'line';
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartDataTipoAtendimento: any[] = [ { data: [], label: '' } ];
  public barChartLabelsTipoAtendimento: string[] = [];
  public barChartDataAtendimentoSituacao: any[] = [ { data: [], label: '' } ];
  public barChartLabelsAtendimentoSituacao: string[] = [];

  constructor(
    public nav: AppNavbarService,
    private fb: FormBuilder,
    public ap: AppComponent,
    private service: MainService) {
    ap.ngOnInit();

  }

  ngOnInit() {
    this.nav.show();
    this.loadDomains();
    this.createGroup();
    this.carregaDashboard();
  }

  loadDomains() {
    this.domains.push({
      periodos: [
        { id: 7, nome: 'Últimos 7 dias' },
        { id: 15, nome: 'Últimos 15 dias' },
        { id: 30, nome: 'Últimos 30 dias' },
        { id: 60, nome: 'Últimos 60 dias' },
        { id: 90, nome: 'Últimos 90 dias' },
      ],
      periodos15: [
        { id: 7, nome: 'Últimos 7 dias' },
        { id: 15, nome: 'Últimos 15 dias' }
      ]
    });
  }

  createGroup() {
    this.form = this.fb.group({
      periodoAtendimento: ['']
    });
  }

  carregaDashboard() {
      this.carregaDashboardAtendimento(null);
      this.carregaDashboardMedicamento(null);
      this.carregaDashboardTipoAtendimento(null);
      this.carregaDashboardAtendimentoSituacao(null);
  }

  carregaDashboardAtendimento(item) {
    this.loading = true;
    this.objectAtendimento.periodo = item ? item.id : 7;
    this.objectAtendimento.periodoNome = item ? item.nome : 'Últimos 7 dias';
    this.lineChartDataAtendimento = [ { data: [] }];

    this.service.carregaQtdAtendimentosPorPeriodo(this.objectAtendimento.periodo).subscribe(result => {
      this.objectAtendimento.qtdTotal = result ? result.qtd : 0;
      this.objectTipoAtendimento.qtdTotal = result ? result.qtd : 0;

      this.service.carregaAtendimentosPorPeriodo(this.objectAtendimento.periodo).subscribe(result => {
        const labels = [];
        for (const item in result) {
          labels.push(result[item].label);
        }
        this.lineChartLabelsAtendimento = labels;

        const data = [];
        for (const item in result) {
          data.push(result[item].data);
        }
        this.lineChartDataAtendimento[0].data = data;
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

  carregaDashboardMedicamento(item) {
    this.loading = true;
    this.objectMedicamento.periodo = item ? item.id : 7;
    this.objectMedicamento.periodoNome = item ? item.nome : 'Últimos 7 dias';
    this.lineChartDataMedicamento = [ { data: [] }];

    this.service.carregaQtdMedicamentosPorPeriodo(this.objectMedicamento.periodo).subscribe(result => {
      this.objectMedicamento.qtdTotal = result ? result.qtd : 0;

      this.service.carregaMedicamentosPorPeriodo(this.objectMedicamento.periodo).subscribe(result => {
        const labels = [];
        for (const item in result) {
          labels.push(result[item].label);
        }
        this.lineChartLabelsMedicamento = labels;

        const data = [];
        for (const item in result) {
          data.push(result[item].data);
        }
        this.lineChartDataMedicamento[0].data = data;
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

  carregaDashboardTipoAtendimento(item) {
    this.loading = true;
    this.objectTipoAtendimento.periodo = item ? item.id : 7;
    this.objectTipoAtendimento.periodoNome = item ? item.nome : 'Últimos 7 dias';

    let tiposAtendimentosExistentes = [];
    let datasExistentes = [];

    this.service.carregaAtendimentosPorPeriodo(this.objectTipoAtendimento.periodo).subscribe(result => {
      const labels = [];
        for (const itemLabel in result) {
          labels.push(result[itemLabel].label);
        }
        this.barChartLabelsTipoAtendimento = labels;
        datasExistentes = labels;

        this.service.carregaTipoAtendimentoExistentePorPeriodo(this.objectTipoAtendimento.periodo).subscribe(result => {
          const nomes = [];
            for (const itemNome in result) {
              nomes.push(result[itemNome].nome);
            }
            tiposAtendimentosExistentes = nomes;

          this.service.carregaTipoAtendimentoPorPeriodo(this.objectTipoAtendimento.periodo).subscribe(resultPorPeriodo => {
            let contador = 0;
            const barChartData = [];
            this.barChartDataTipoAtendimento = [ { data: [], label: '' } ];

            //verifico os tipos de ficha
            for (const itemTipo in tiposAtendimentosExistentes) {
              const data = [];
              barChartData.push({ data: [], label: tiposAtendimentosExistentes[itemTipo] });

              //verifico os dias
              for (const itemDia in datasExistentes) {
                const t = resultPorPeriodo.filter((itemResultPorPeriodo) => itemResultPorPeriodo.label == datasExistentes[itemDia] && itemResultPorPeriodo.nome == tiposAtendimentosExistentes[itemTipo]);
                data.push(t[0] ? t[0].data : '0');
              }
              barChartData[contador].data = data;
              contador++;
            }

            if (barChartData.length > 0) {
              this.barChartDataTipoAtendimento = barChartData;
            }

            this.loading = false;

            if (!item) {
              this.carregaDashboardTipoAtendimento({id: 7, nome: 'Últimos 7 dias'});
            }

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

  carregaDashboardAtendimentoSituacao(item) {
    this.loading = true;
    this.objectAtendimentoSituacao.periodo = item ? item.id : 7;
    this.objectAtendimentoSituacao.periodoNome = item ? item.nome : 'Últimos 7 dias';

    let atendimentosSituacoesExistentes = [];
    let datasExistentes = [];

    this.service.carregaAtendimentosPorPeriodo(this.objectAtendimentoSituacao.periodo).subscribe(result => {
      const labels = [];
        for (const itemLabel in result) {
          labels.push(result[itemLabel].label);
        }
        this.barChartLabelsAtendimentoSituacao = labels;
        datasExistentes = labels;

        this.service.carregaAtendimentoSituacaoExistentePorPeriodo(this.objectAtendimentoSituacao.periodo).subscribe(result => {
          const situacoes = [];
            for (const itemSituacao in result) {
              situacoes.push(result[itemSituacao].situacao);
            }
            atendimentosSituacoesExistentes = situacoes;

          this.service.carregaAtendimentoSituacaoPorPeriodo(this.objectAtendimentoSituacao.periodo).subscribe(resultPorPeriodo => {
            let contador = 0;
            const barChartData = [];
            this.barChartDataAtendimentoSituacao = [ { data: [], label: '' } ];

            //verifico os tipos de ficha
            for (const itemTipo in atendimentosSituacoesExistentes) {
              const data = [];
              barChartData.push({ data: [], label: atendimentosSituacoesExistentes[itemTipo] });

              //verifico os dias
              for (const itemDia in datasExistentes) {
                const t = resultPorPeriodo.filter((itemResultPorPeriodo) => itemResultPorPeriodo.label == datasExistentes[itemDia] && itemResultPorPeriodo.situacao == atendimentosSituacoesExistentes[itemTipo]);
                data.push(t[0] ? t[0].data : '0');
              }
              barChartData[contador].data = data;
              contador++;
            }

            if (barChartData.length > 0) {
              this.barChartDataAtendimentoSituacao = barChartData;
            }

            this.loading = false;

            if (!item) {
              this.carregaDashboardAtendimentoSituacao({id: 7, nome: 'Últimos 7 dias'});
            }

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

  public barChartOptions: any = {
    responsive: true,
    layout: {
      padding: {
        left: 5,
        right: 5,
        top: 0,
        bottom: 3
      }
    },
  };
  public lineChartColors: Array<any> = this.renderBgChart('rgba(0, 0, 0, 0)', 'rgba(255,255,255,1)', 'rgba(255,255,255,1)', '#fff', '#B4B4B4', 'rgba(255,255,255,0.8)');
  public lineChartColors2: Array<any> = this.renderBgChart('rgba(0, 0, 0, 0)', 'rgba(219,219,219,1)', 'rgba(219,219,219,1)', '#00929c', 'rgb(77, 111, 160,1)', 'rgba(46,79,143,0.8)');
  public barchartColor: Array<any> =  [
    {
      backgroundColor: 'rgb(77, 111, 160, 1)',
      hoverBackgroundColor: 'rgb(85, 124, 178, 0.8)'
    }, {
      backgroundColor: 'rgb(70, 78, 86, 1)',
      hoverBackgroundColor: 'rgba(219,219,219,0.8)',
    },
    {
      backgroundColor: 'rgb(0, 90, 47, 1)',
      hoverBackgroundColor: 'rgba(87, 142, 116, 0.8)',
    },
    {
      backgroundColor: 'rgb(95, 64, 0, 1)',
      hoverBackgroundColor: 'rgba(150, 127, 79, 0.8)',
    },
    {
      backgroundColor: 'rgb(162, 44, 123, 1)',
      hoverBackgroundColor: 'rgba(148, 58, 118, 0.8)',
    },
    {
      backgroundColor: 'rgb(40, 152, 41, 1)',
      hoverBackgroundColor: 'rgba(58, 148, 59, 0.8)',
    },
    {
      backgroundColor: 'rgb(158, 125, 39)',
      hoverBackgroundColor: 'rgba(148, 123, 58, 0.8)',
    },
    {
      backgroundColor: 'rgb(160, 61, 40)',
      hoverBackgroundColor: 'rgba(144, 68, 52, 0.8)',
    },
    {
      backgroundColor: 'rgb(49, 212, 208)',
      hoverBackgroundColor: 'rgba(89, 214, 211, 0.8)',
    }
  ];

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  public renderBgChart(bg, border, pointBg, pointBorder, pointHoverBg, pointHoverBorder) {
    const lineChartColors: Array<any> = [
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
