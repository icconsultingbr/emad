import { NgModule } from "@angular/core";
import { CoreModule } from "../../../_core/core.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppGridViewModule } from "../../../_core/_components/app-grid-view/app-grid-view.module";
import { AppFormModule } from "../../../_core/_components/app-form/app-form.module";
import { CorClassificacaoRiscoComponent } from "./cor-classificacao-risco.component";
import { CorClassificacaoRiscoFormComponent } from "./cor-classificacao-risco-form.component";
import { CorClassificacaoRiscoService } from "./cor-classificacao-risco.service";
import { corClassificacaoRiscoRoutes } from "./cor-classificacao-risco.routing";

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(corClassificacaoRiscoRoutes)
    ],
    declarations: [
        CorClassificacaoRiscoComponent,
        CorClassificacaoRiscoFormComponent,
    ],
    providers: [
        CorClassificacaoRiscoService
    ]
})
export class CorClassificacaoRiscoModule {
}