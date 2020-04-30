import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { AppNavbarService } from '../_core/_components/app-navbar/app-navbar.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  dash : Boolean = false;

  constructor(public nav: AppNavbarService, public ap: AppComponent) {
    ap.ngOnInit();

  }

  ngOnInit() {
    this.nav.show();
  }


  public lineChartData: Array<any> = [
    { data: [100, 324, 112, 355, 400, 100, 40] }
  ];


  public lineChartLabels: Array<any> = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho'];
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
