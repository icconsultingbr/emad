import { Component, OnInit } from "@angular/core";
import { TipoEscolaridadeService } from "./tipo-escolaridade.service";
import { TipoEscolaridade } from "../../../_core/_models/TipoEscolaridade";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-tipo-escolaridade-form",
  templateUrl: "./tipo-escolaridade-form.component.html",
  styleUrls: ["./tipo-escolaridade-form.component.css"],
  providers: [TipoEscolaridadeService],
})
export class TipoEscolaridadeFormComponent implements OnInit {
  object: TipoEscolaridade = new TipoEscolaridade();
  method: string = "escolaridade";
  fields: any[] = [];
  label: string = "Escolaridade";
  id: Number = null;

  constructor(
    fb: FormBuilder,
    private service: TipoEscolaridadeService,
    private route: ActivatedRoute
  ) {
    this.fields = service.fields;
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.id = params["id"];
    });
  }
}
