import { NgModule } from "@angular/core";
import { CoreModule } from "../../_core/core.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppGridViewModule } from "../../_core/_components/app-grid-view/app-grid-view.module";
import { AppFormModule } from "../../_core/_components/app-form/app-form.module";
import { MenuComponent } from "./menu.component";
import { MenuFormComponent } from "./menu-form.component";
import { MenuService } from "./menu.service";
import { menuRoutes } from "./menu.routing";

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(menuRoutes)
    ],
    declarations: [
        MenuComponent,
        MenuFormComponent,
    ],
    providers: [
        MenuService
    ]
})
export class MenuModule {
}