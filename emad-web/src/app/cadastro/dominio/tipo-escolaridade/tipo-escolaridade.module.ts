import { NgModule } from "@angular/core";
import { CoreModule } from "../../../_core/core.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppGridViewModule } from "../../../_core/_components/app-grid-view/app-grid-view.module";
import { AppFormModule } from "../../../_core/_components/app-form/app-form.module";
import { TipoEscolaridadeRoutes } from "./tipo-escolaridade.routing";
import { TipoEscolaridadeFormComponent } from "./tipo-escolaridade-form.component";
import { TipoEscolaridadeComponent } from "./tipo-escolaridade.component";
import { TipoEscolaridadeService } from "./tipo-escolaridade.service";

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    AppGridViewModule,
    AppFormModule,
    RouterModule.forChild(TipoEscolaridadeRoutes),
  ],
  declarations: [TipoEscolaridadeComponent, TipoEscolaridadeFormComponent],
  providers: [TipoEscolaridadeService],
})
export class TipoEscolaridadeModule {}
