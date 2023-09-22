import { Routes } from "@angular/router";
import { TipoEscolaridadeFormComponent } from "./tipo-escolaridade-form.component";
import { TipoEscolaridadeComponent } from "./tipo-escolaridade.component";

export const TipoEscolaridadeRoutes: Routes = [
  {
    path: "",
    component: TipoEscolaridadeComponent,
  },
  {
    path: "cadastro",
    component: TipoEscolaridadeFormComponent,
  },
  {
    path: "cadastro/:id",
    component: TipoEscolaridadeFormComponent,
  },
];
