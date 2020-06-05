import { Component, OnInit } from '@angular/core';
import { LivroService } from './livro.service';
import { Livro } from '../../_core/_models/Livro';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-livro-form',
    templateUrl: './livro-form.component.html',
    styleUrls: ['./livro-form.component.css'],
    providers: [LivroService]
})

export class LivroFormComponent implements OnInit {

  object: Livro = new Livro();
  method: String = "livro";
  fields: any[] = [];
  label: String = "Livros";
  id: Number = null;
  domains: any[] = [];

  constructor(
    fb: FormBuilder,
    private service: LivroService,
    private route: ActivatedRoute) {
      this.fields = service.fields;
    }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });

  }

}