import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { VisualizacaoPowerBiService } from './visualizacao-power-bi.service';

@Component({
    selector: 'app-visualizacao-power-bi',
    templateUrl: './visualizacao-power-bi.component.html',
    styleUrls: ['./visualizacao-power-bi.component.css'],
    providers: [VisualizacaoPowerBiService]
})

export class VisualizacaoPowerBIComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private ref: ChangeDetectorRef,
    private visualizacaoPowerBIService: VisualizacaoPowerBiService) {
    }

  urlBI: string;
  ngOnInit() {
    this.visualizacaoPowerBIService.buscaPorChaveId('IFRAME_POWER_BI').subscribe(res => {
        this.urlBI = res.VALOR;
        (<HTMLIFrameElement>document.getElementById('powerbiIframe')).src = this.urlBI;
      }
    );
  }
}
