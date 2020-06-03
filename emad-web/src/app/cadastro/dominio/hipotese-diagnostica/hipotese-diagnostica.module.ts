import { NgModule } from "@angular/core";
import { CoreModule } from "../../../_core/core.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppGridViewModule } from "../../../_core/_components/app-grid-view/app-grid-view.module";
import { AppFormModule } from "../../../_core/_components/app-form/app-form.module";
import { HipoteseDiagnosticaComponent } from "./hipotese-diagnostica.component";
import { HipoteseDiagnosticaFormComponent } from "./hipotese-diagnostica-form.component";
import { HipoteseDiagnosticaService } from "./hipotese-diagnostica.service";
import { hipoteseDiagnosticaRoutes } from "./hipotese-diagnostica.routing";

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(hipoteseDiagnosticaRoutes)
    ],
    declarations: [
        HipoteseDiagnosticaComponent,
        HipoteseDiagnosticaFormComponent,
    ],
    providers: [
        HipoteseDiagnosticaService
    ]
})
export class HipoteseDiagnosticaModule {
}