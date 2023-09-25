import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Util } from '../../_core/_util/Util';
import { Router, ActivatedRoute } from '@angular/router';
import { Atendimento } from '../../_core/_models/Atendimento';
import { AtendimentoService } from '../atendimento/atendimento.service';

@Component({
  selector: 'app-reabertura-atendimento',
  templateUrl: './reabertura-atendimento.component.html',
  styleUrls: ['./reabertura-atendimento.component.css'],
  providers: [AtendimentoService]
})
export class ReaberturaAtendimentoComponent implements OnInit {

  loading: Boolean = false;
  message = '';
  errors: any[] = [];
  form: FormGroup;
  fields: any[] = [];

  constructor(
    private fb: FormBuilder,
    private service: AtendimentoService,
    private router: Router) {
  }

  ngOnInit() {
    this.createGroup();
  }

  createGroup() {
    this.form = this.fb.group({
      numero: ['', '']
    });
  }

  reabreAtendimento() {
    this.message = '';
    this.errors = [];
    this.loading = true;

    this.service.reabreAtendimento(this.form.value).subscribe(result => {
      this.loading = false;
      this.message = 'Atendimento(s) reaberto(s) com sucesso!';
    }, error => {
      this.loading = false;
      this.errors = Util.customHTTPResponse(error);
    });
  }

}
