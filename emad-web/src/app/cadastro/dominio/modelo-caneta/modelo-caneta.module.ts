import { NgModule } from "@angular/core";
import { CoreModule } from "../../../_core/core.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppGridViewModule } from "../../../_core/_components/app-grid-view/app-grid-view.module";
import { AppFormModule } from "../../../_core/_components/app-form/app-form.module";
import { ModeloCanetaComponent } from "./modelo-caneta.component";
import { ModeloCanetaFormComponent } from "./modelo-caneta-form.component";
import { ModeloCanetaService } from "./modelo-caneta.service";
import { modeloCanetaRoutes } from "./modelo-caneta.routing";

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(modeloCanetaRoutes)
    ],
    declarations: [
        ModeloCanetaComponent,
        ModeloCanetaFormComponent,
    ],
    providers: [
        ModeloCanetaService
    ]
})
export class ModeloCanetaModule {
}