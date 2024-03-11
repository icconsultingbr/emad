import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UrlExternaService } from './url-externa.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-url-externa',
  templateUrl: './url-externa.component.html',
  styleUrls: ['./url-externa.component.css'],
  providers: [UrlExternaService]
})

export class UrlExternaComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private ref: ChangeDetectorRef,
    private urlExternaService: UrlExternaService,
    private route: ActivatedRoute) {
    }

    menuId: 0;
    url: string;
    label: string;
    ngOnInit() {
  
      this.route.params.subscribe(params => {
        this.menuId = params['id'];
  
        this.urlExternaService.buscaPorChaveId(this.menuId).subscribe(res => {
          this.label = res.nome;
          this.url = res.rota;
          (<HTMLIFrameElement>document.getElementById('urlIframe')).src = this.url;
        }
      );
       });   
    }
}
