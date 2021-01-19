import { NgModule } from "@angular/core";
import { CoreModule } from "../../../_core/core.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppGridViewModule } from "../../../_core/_components/app-grid-view/app-grid-view.module";
import { AppFormModule } from "../../../_core/_components/app-form/app-form.module";
import { TipoExameComponent } from "./tipo-exame.component";
import { TipoExameFormComponent } from "./tipo-exame-form.component";
import { TipoExameService } from "./tipo-exame.service";
import { tipoExameRoutes } from "./tipo-exame.routing";

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(tipoExameRoutes)
    ],
    declarations: [
        TipoExameComponent,
        TipoExameFormComponent,
    ],
    providers: [
        TipoExameService
    ]
})
export class TipoExameModule {
}