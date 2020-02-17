import { Injectable } from '@angular/core';
import { GenericsService } from '../../_core/_services/generics.service';

@Injectable()
export class GeorreferenciamentoService extends GenericsService{
  
    fields1: any[] = [
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

      fields2: any[] = [
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
          field: "cnes",
          type: "text",
          label: "CNES",
          grid: true,
          form: true,
          required: false,
          validator: ['', ''],
        },
        {
          field: "cnpj",
          type: "text",
          label: "CNPJ",
          mask: "99.999.999/9999-99",
          placeholder: "99.999.999/9999-99",
          grid: true,
          form: true,
          required: true,
          validator: ['', '']
        },
        {
          field: "razaoSocial",
          type: "text",
          label: "Razão Social",
          grid: true,
          form: true,
          required: true,
          validator: ['', '']
        },        
      ];

}