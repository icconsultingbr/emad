import { Injectable } from '@angular/core';
import { GenericsService } from '../../../_core/_services/generics.service';
import { Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Estoque } from '../../../_core/_models/Estoque';

@Injectable()
export class BloqueioLoteService extends GenericsService {

  constructor(public http: HttpClient) {
    super(http);
  }

  public fields: any[] = [    
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
      field: "codigoMaterial",
      type: "text",
      label: "Código",
      grid: true,
      form: false,
      required: false,
      validator: ['','']
    },
    {
      field: "idFabricanteMaterial",
      type: "select",
      label: "Fabricante",
      grid: false,
      form: true,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "nomeFabricanteMaterial",
      type: "text",
      label: "Fabricante",
      grid: true,
      form: false,
      required: false,
      validator: ['', '']
    },
    {
      field: "idMaterial",
      type: "text",
      label: "Material",
      grid: false,
      form: true,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "nomeMaterial",
      type: "text",
      label: "Material",
      grid: true,
      form: false,
      required: false,
      validator: ['', '']
    },
    {
      field: "idEstabelecimento",
      type: "hidden",
      label: "Estabelecimento",
      grid: false,
      form: true,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "lote",
      type: "text",
      label: "Lote",
      grid: true,
      form: true,
      required: true,
      validator: ['', Validators.required]
    },    
    {
      field: "quantidade",
      type: "text",
      label: "Quantidade",
      grid: true,
      form: true,
      required: true,
      validator: ['', Validators.required]
    },
    {
      field: "validade",
      type: "text",
      label: "Validade",
      grid: false,
      form: true,
      required: true,
      mask: "99/99/9999",      
      validator: ['', Validators.required]
    },
    {
      field: "bloqueado",
      type: "checkbox",
      label: "Bloqueado",
      grid: true,
      form: true,
      required: false,
      validator: ['', ''],
      translate: {1: "Sim", 0: "Não"},
    },
    {
      field: "motivoBloqueio",
      type: "text",
      label: "Motivo bloqueio",
      grid: false,
      form: true,
      required: false,
      validator: ['', '']
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

  public buscaPorId(id: number) : Observable<any>{
    return this.http.get("estoque/"+id);
  }

  bloquearLote(obj: any){ 
    return this.http.put("estoque/bloquear-lote", JSON.stringify(obj));
  }  
}