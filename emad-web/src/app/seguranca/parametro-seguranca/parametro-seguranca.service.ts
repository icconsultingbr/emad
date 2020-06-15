import { Injectable } from '@angular/core';
import { GenericsService } from '../../_core/_services/generics.service';
import { Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ParametroSegurancaService extends GenericsService {

  constructor(public http: HttpClient) {
    super(http);
  }

  public fields : any[] = [
    {
      field:"id",
      type:"hidden", 
      label:"Id", 
      grid: true,
      form: true,
      required: false, 
      validator: ['', '']
    },
    {
      field: "nome", 
      type: "text", 
      label: "Nome", 
      grid: true,  
      form: true,
      required: true, 
      validator:['', Validators.required]
    },    
    {
      field: "valor", 
      type: "text", 
      label: "Valor", 
      grid: true,  
      form: true,
      required: true, 
      validator:['', Validators.required]
    },  
    {
      field: "observacao", 
      type: "text", 
      label: "Observações", 
      grid: true,  
      form: true,
      required: false, 
      validator:['', '']
    },
    {
      field: "mascaraGrid", 
      type: "checkbox", 
      label: "Aplicar máscara no grid", 
      grid: false,  
      form: true,      
      required: false, 
      validator:['', '']
    },
    {
      field: "situacao", 
      type: "checkbox", 
      label: "Situação", 
      grid: true,  
      form: true,
      translate: {1: "Ativo", 0: "Inativo"},
      required: true, 
      validator:['', Validators.required]
    }
  ];
}
