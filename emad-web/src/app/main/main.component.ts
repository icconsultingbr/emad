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
  providers:[MainService]
})

export class MainComponent implements OnInit {
  
  objectAtendimento: MainChartLine = new MainChartLine();  
  objectMedicamento: MainChartLine = new MainChartLine();  
  objectTipoAtendimento: MainChartLine = new MainChartLine();    
  method: String = 'profissional';
  fields = [];
  label: String = "Profissional";
  id: Number = null;
  domains: any[] = [];
  loading: Boolean = false;
  errors: any[] = [];
  dash : Boolean = false;
  form: FormGroup;

  public lineChartDataAtendimento: Array<any> = [ { data: [] } ];
  public lineChartLabelsAtendimento: Array<any> = [];
  public lineChartDataMedicamento: Array<any> = [ { data: [] } ];
  public lineChartLabelsMedicamento: Array<any> = [];
  public lineChartDataTipoAtendimento: Array<any> = [ { data: [] } ];
  public lineChartLabelsTipoAtendimento: Array<any> = [];

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
        { id: 7, nome: "Últimos 7 dias" },
        { id: 15, nome: "Últimos 15 dias" },
        { id: 30, nome: "Últimos 30 dias" },
        { id: 60, nome: "Últimos 60 dias" },
        { id: 90, nome: "Últimos 90 dias" },
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
  }

  carregaDashboardAtendimento(item) {    
    this.loading = true;
    this.objectAtendimento.periodo = item ? item.id : 7;    
    this.objectAtendimento.periodoNome = item ? item.nome : 'Últimos 7 dias';    
    this.lineChartDataAtendimento = [ { data: [] }];    

    this.service.carregaQtdAtendimentosPorPeriodo(this.objectAtendimento.periodo).subscribe(result => {     
      this.objectAtendimento.qtdTotal = result ? result.qtd : 0;

      this.service.carregaAtendimentosPorPeriodo(this.objectAtendimento.periodo).subscribe(result => {            
        this.lineChartLabelsAtendimento = result ? result.label : [];
        var teste = [];
        for(var item in result){        
          teste.push(result[item].label);
        } 
        this.lineChartLabelsAtendimento = teste;
  
        var teste2 = [];
        for(var item in result){        
          teste2.push(result[item].data);
        } 
        this.lineChartDataAtendimento[0].data = teste2;
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
    this.objectMedicamento.periodo = item ? item.id : 1;    
    this.objectMedicamento.periodoNome = item ? item.nome : 'Últimos 7 dias';
    this.objectMedicamento.qtdTotal = 300;
    this.lineChartDataMedicamento = [
      { data: [100, 324, 112, 355, 400, 100, 40] }
    ];
    this.lineChartLabelsMedicamento = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho'];
  }

  carregaDashboardTipoAtendimento(item) {    
    this.objectTipoAtendimento.periodo = item ? item.id : 1;    
    this.objectTipoAtendimento.periodoNome = item ? item.nome : 'Últimos 7 dias';
    this.objectTipoAtendimento.qtdTotal = 400;
    this.lineChartDataTipoAtendimento = [
      { data: [100, 324, 112, 355, 400, 100, 40] }
    ];
    this.lineChartLabelsTipoAtendimento = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho'];
  }
  
  metodoHeleno(item){
    var teste = item;
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
    { // grey
      backgroundColor:'rgb(77, 111, 160, 1)',
      hoverBackgroundColor: 'rgb(85, 124, 178, 0.8)'
    }, { // grey
      backgroundColor: 'rgb(70, 78, 86, 1)',
      hoverBackgroundColor: 'rgba(219,219,219,0.8)',
    },
  ];

  public lineChartLegend: boolean = false;
  public lineChartType: string = 'line';

  public barChartLabels: string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;
  public barChartData: any[] = [
    {
      data: [65, 59, 80, 81, 56, 55, 40],
      label: 'Pronto atendimento'
    },
    {
      data: [28, 48, 40, 19, 86, 27, 90],
      label: 'Unidade básica de saúde'
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
