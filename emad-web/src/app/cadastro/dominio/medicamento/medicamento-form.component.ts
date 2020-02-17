import { Component, OnInit } from '@angular/core';
import { Medicamento } from '../../../_core/_models/Medicamento';
import { MedicamentoService } from './medicamento.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-medicamento-form',
  templateUrl: './medicamento-form.component.html',
  styleUrls: ['./medicamento-form.component.css'],
  providers: [MedicamentoService]
})
export class MedicamentoFormComponent implements OnInit {

  object: Medicamento = new Medicamento();
  method: String = 'medicamento';
  fields: any[] = [];
  label: String = "Medicamento";
  id: Number = null;

  constructor(
    fb: FormBuilder,
    private service: MedicamentoService,
    private route: ActivatedRoute) {
    this.fields = service.fields;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
  }

}
