import { Injectable } from '@angular/core';
import { GenericsService } from '../../_core/_services/generics.service';

@Injectable()
export class PlanoTerapeuticoService extends GenericsService{
  
    fields: any[] = [
        {
          field: "id",
          type: "hidden",
          label: "Id",
          grid: false,
          form: true,
          required: false,
          validator: ['', '']
        },
        {
          field: "cartaoSus",
          type: "text",
          label: "Cartão SUS",
          grid: true,
          form: false,
          required: false,
          validator: ['', '']
        },        
        {
          field: "idSap",
          type: "text",
          label: "Número SAP",
          grid: true,
          form: false,
          required: false,
          validator: ['', '']
        },
        {
            field: "nome",
            type: "text",
            label: "Nome",
            grid: true,
            form: false,
            required: false,
            validator: ['', '']
        },
        {
            field: "nomeMae",
            type: "text",
            label: "Nome da mãe",
            grid: true,
            form: false,
            required: false,
            validator: ['', '']
        },
        {
            field: "dataNascimento",
            type: "text",
            label: "Data Nascimento",
            grid: true,
            isDate: true,
            form: false,
            required: false,
            validator: ['', '']
        },
      ];

     

}
