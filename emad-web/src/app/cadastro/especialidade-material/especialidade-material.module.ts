import { NgModule } from "@angular/core";
import { CoreModule } from "../../_core/core.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppGridViewModule } from "../../_core/_components/app-grid-view/app-grid-view.module";
import { AppFormModule } from "../../_core/_components/app-form/app-form.module";
import { EspecialidadeMaterialFormComponent } from "./especialidade-material-form.component";
import { EspecialidadeMaterialService } from "./especialidade-material.service";
import { especialidadeMaterialRoutes } from "./especialidade-material.routing";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(especialidadeMaterialRoutes)
    ],
    declarations: [
        EspecialidadeMaterialFormComponent,
    ],
    providers: [
        EspecialidadeMaterialService
    ]
})
export class EspecialidadeMaterialModule {
}