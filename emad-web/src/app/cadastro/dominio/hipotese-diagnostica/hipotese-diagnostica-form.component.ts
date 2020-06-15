import { Component, OnInit } from '@angular/core';
import { HipoteseDiagnosticaService } from './hipotese-diagnostica.service';
import { HipoteseDiagnostica } from '../../../_core/_models/HipoteseDiagnostica';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-hipotese-diagnostica-form',
  templateUrl: './hipotese-diagnostica-form.component.html',
  styleUrls: ['./hipotese-diagnostica-form.component.css'],
  providers: [HipoteseDiagnosticaService]
})
export class HipoteseDiagnosticaFormComponent implements OnInit {

  object: HipoteseDiagnostica = new HipoteseDiagnostica();
  method: string = 'hipotese-diagnostica';
  fields: any[] = [];
  label: string = "Hipótese Diagnóstica";
  id: Number = null;

  constructor(
    fb: FormBuilder,
    private service: HipoteseDiagnosticaService,
    private route: ActivatedRoute) {
      this.fields = service.fields;
    }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
  }
}
