import { NgModule } from "@angular/core";
import { CoreModule } from "../../_core/core.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppGridViewModule } from "../../_core/_components/app-grid-view/app-grid-view.module";
import { AppFormModule } from "../../_core/_components/app-form/app-form.module";
import { LogComponent } from "./log.component";
import { LogService } from "./log.service";
import { logRoutes } from "./log.routing";

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(logRoutes)
    ],
    declarations: [
        LogComponent
    ],
    providers: [
        LogService
    ]
})
export class LogModule {
}