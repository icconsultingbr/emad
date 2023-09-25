import { Component, OnInit } from "@angular/core";
import { AppNavbarService } from "../../../_core/_components/app-navbar/app-navbar.service";
import { TipoEscolaridadeService } from "./tipo-escolaridade.service";
import { TipoEscolaridade } from "../../../_core/_models/TipoEscolaridade";

@Component({
  selector: "app-tipo-escolaridade",
  templateUrl: "./tipo-escolaridade.component.html",
  styleUrls: ["./tipo-escolaridade.component.css"],
  providers: [TipoEscolaridadeService],
})
export class TipoEscolaridadeComponent implements OnInit {
  method: string = "escolaridade";
  object: TipoEscolaridade = new TipoEscolaridade();
  fields: any[] = [];
  fieldsSearch: any[] = [];

  constructor(
    public nav: AppNavbarService,
    private service: TipoEscolaridadeService
  ) {
    for (let field of this.service.fields) {
      if (field.grid) {
        this.fields.push(field);
      }
      if (field.filter) {
        this.fieldsSearch.push(field);
      }
    }
  }

  ngOnInit() {
    this.nav.show();
  }
}
