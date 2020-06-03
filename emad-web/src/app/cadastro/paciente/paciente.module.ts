import { NgModule } from "@angular/core";
import { CoreModule } from "../../_core/core.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppGridViewModule } from "../../_core/_components/app-grid-view/app-grid-view.module";
import { AppFormModule } from "../../_core/_components/app-form/app-form.module";
import { PacienteComponent } from "./paciente.component";
import { PacienteFormComponent } from "./paciente-form.component";
import { PacienteService } from "./paciente.service";
import { pacienteRoutes } from "./paciente.routing";

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(pacienteRoutes)
    ],
    declarations: [
        PacienteComponent,
        PacienteFormComponent,
    ],
    providers: [
        PacienteService
    ]
})
export class PacienteModule {
}