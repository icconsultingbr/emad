import { NgModule } from "@angular/core";
import { CoreModule } from "../../../_core/core.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppGridViewModule } from "../../../_core/_components/app-grid-view/app-grid-view.module";
import { AppFormModule } from "../../../_core/_components/app-form/app-form.module";
import { SubGrupoMaterialComponent } from "./sub-grupo-material.component";
import { SubGrupoMaterialFormComponent } from "./sub-grupo-material-form.component";
import { SubGrupoMaterialService } from "./sub-grupo-material.service";
import { subGrupoMaterialRoutes } from "./sub-grupo-material.routing";

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(subGrupoMaterialRoutes)
    ],
    declarations: [
        SubGrupoMaterialComponent,
        SubGrupoMaterialFormComponent,
    ],
    providers: [
        SubGrupoMaterialService
    ]
})
export class SubGrupoMaterialModule {
}