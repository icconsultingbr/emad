import { NgModule } from "@angular/core";
import { CoreModule } from "../../_core/core.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppGridViewModule } from "../../_core/_components/app-grid-view/app-grid-view.module";
import { AppFormModule } from "../../_core/_components/app-form/app-form.module";
import { EquipeComponent } from "./equipe.component";
import { EquipeFormComponent } from "./equipe-form.component";
import { EquipeService } from "./equipe.service";
import { equipeRoutes } from "./equipe.routing";

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(equipeRoutes)
    ],
    declarations: [
        EquipeComponent,
        EquipeFormComponent,
    ],
    providers: [
        EquipeService
    ]
})
export class EquipeModule {
}