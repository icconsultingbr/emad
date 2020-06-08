import { NgModule } from "@angular/core";
import { CoreModule } from "../../_core/core.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppGridViewModule } from "../../_core/_components/app-grid-view/app-grid-view.module";
import { AppFormModule } from "../../_core/_components/app-form/app-form.module";
import { EstabelecimentoGrupoMaterialComponent } from "./estabelecimento-grupo-material.component";
import { EstabelecimentoGrupoMaterialFormComponent } from "./estabelecimento-grupo-material-form.component";
import { EstabelecimentoGrupoMaterialService } from "./estabelecimento-grupo-material.service";
import { estabelecimentoGrupoMaterialRoutes } from "./estabelecimento-grupo-material.routing";

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(estabelecimentoGrupoMaterialRoutes)
    ],
    declarations: [
        EstabelecimentoGrupoMaterialComponent,
        EstabelecimentoGrupoMaterialFormComponent,
    ],
    providers: [
        EstabelecimentoGrupoMaterialService
    ]
})
export class EstabelecimentoGrupoMaterialModule {
}