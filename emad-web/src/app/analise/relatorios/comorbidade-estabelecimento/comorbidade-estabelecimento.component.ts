import { Component, OnInit } from '@angular/core';
import { ComorbidadeEstabelecimento } from '../../../_core/_models/ComorbidadeEstabelecimento';
import { ComorbidadeEstabelecimentoService } from './comorbidade-estabelecimento.service';

@Component({
  selector: 'app-comorbidade-estabelecimento',
  templateUrl: './comorbidade-estabelecimento.component.html',
  styleUrls: ['./comorbidade-estabelecimento.component.css']
})
export class ComorbidadeEstabelecimentoComponent implements OnInit {


  loading: Boolean = false;
  message: string = "";
  errors: any[] = [];

  //MODELS (OBJECTS)
  object: ComorbidadeEstabelecimento = new ComorbidadeEstabelecimento();

  constructor(
    private service: ComorbidadeEstabelecimentoService,
  ) { }


  ngOnInit() {
    console.log(this.object)
  }

}
