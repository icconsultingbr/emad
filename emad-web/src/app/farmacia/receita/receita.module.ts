import { NgModule } from "@angular/core";
import { CoreModule } from "../../_core/core.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppGridViewModule } from "../../_core/_components/app-grid-view/app-grid-view.module";
import { AppFormModule } from "../../_core/_components/app-form/app-form.module";
import { ReceitaComponent } from "./receita.component";
import { ReceitaFormComponent } from "./receita-form.component";
import { ReceitaService } from "./receita.service";
import { receitaRoutes } from "./receita.routing";

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(receitaRoutes)
    ],
    declarations: [
        ReceitaComponent,
        ReceitaFormComponent,
    ],
    providers: [
        ReceitaService
    ]
})
export class ReceitaModule {
}