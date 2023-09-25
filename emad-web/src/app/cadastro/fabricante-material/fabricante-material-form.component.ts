import { Component, OnInit } from '@angular/core';
import { FabricanteMaterialService } from './fabricante-material.service';
import { FabricanteMaterial } from '../../_core/_models/FabricanteMaterial';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-fabricante-material-form',
    templateUrl: './fabricante-material-form.component.html',
    styleUrls: ['./fabricante-material-form.component.css'],
    providers: [FabricanteMaterialService]
})

export class FabricanteMaterialFormComponent implements OnInit {

  object: FabricanteMaterial = new FabricanteMaterial();
  method = 'fabricante-material';
  fields: any[] = [];
  label = 'Fabricante de material';
  id: Number = null;
  domains: any[] = [];

  constructor(
    fb: FormBuilder,
    private service: FabricanteMaterialService,
    private route: ActivatedRoute) {
      this.fields = service.fields;
    }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });

  }

}
