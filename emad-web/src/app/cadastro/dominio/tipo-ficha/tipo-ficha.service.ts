import { Injectable } from '@angular/core';
import { GenericsService } from '../../../_core/_services/generics.service';
import { Validators } from '@angular/forms';

@Injectable()
export class TipoFichaService extends GenericsService {

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
      field: "xmlTemplate", 
      type: "textarea", 
      label: "XML Template", 
      grid: false,  
      form: true,
      required: true, 
      validator:['', Validators.required]
    },    
    {
      field: "queryTemplate", 
      type: "textarea", 
      label: "Query template", 
      grid: false,  
      form: true,
      required: true, 
      validator:['', Validators.required]
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
