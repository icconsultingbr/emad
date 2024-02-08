import { Component, OnInit } from '@angular/core';
import { Genero } from '../../../_core/_models/Genero';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GeneroService } from './genero.service';

@Component({
  selector: 'app-genero-form',
  templateUrl: './genero-form.component.html',
  styleUrls: ['./genero-form.component.css'],
  providers: [GeneroService]
})

export class GeneroFormComponent implements OnInit {

  object: Genero = new Genero();
  method = 'genero';
  fields: any[] = [];
  label = 'Gênero';
  id: Number = null;

  constructor(
    fb: FormBuilder,
    private service: GeneroService,
    private route: ActivatedRoute) {
    this.fields = service.fields;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });
  }
}
