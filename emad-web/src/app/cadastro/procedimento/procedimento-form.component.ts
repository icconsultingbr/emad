import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Profissional } from '../../_core/_models/Profissional';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Util } from '../../_core/_util/Util';
import { ProcedimentoService } from './procedimento.service';
import { Procedimento } from '../../_core/_models/Procedimento';

@Component({
  selector: 'app-procedimento-form',
  templateUrl: './procedimento-form.component.html',
  styleUrls: ['./procedimento-form.component.css'],
  providers: [ProcedimentoService]
})
export class ProcedimentoFormComponent implements OnInit {

  object: Procedimento = new Procedimento();
  method = 'procedimento';
  fields: any[] = [];
  label = 'Procedimento';
  id: Number = null;
  domains: any[] = [];
  loading = false;

  constructor(
    fb: FormBuilder,
    private service: ProcedimentoService,
    private route: ActivatedRoute) {
    this.fields = service.fields;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
  }
}
