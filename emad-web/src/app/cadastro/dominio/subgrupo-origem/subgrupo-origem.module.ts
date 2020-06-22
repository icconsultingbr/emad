import { NgModule } from "@angular/core";
import { CoreModule } from "../../../_core/core.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppGridViewModule } from "../../../_core/_components/app-grid-view/app-grid-view.module";
import { AppFormModule } from "../../../_core/_components/app-form/app-form.module";
import { SubgrupoOrigemComponent } from "./subgrupo-origem.component";
import { SubgrupoOrigemFormComponent } from "./subgrupo-origem-form.component";
import { SubgrupoOrigemService } from "./subgrupo-origem.service";
import { subgrupoOrigemRoutes } from "./subgrupo-origem.routing";

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(subgrupoOrigemRoutes)
    ],
    declarations: [
        SubgrupoOrigemComponent,
        SubgrupoOrigemFormComponent,
    ],
    providers: [
        SubgrupoOrigemService
    ]
})
export class SubgrupoOrigemModule {
}