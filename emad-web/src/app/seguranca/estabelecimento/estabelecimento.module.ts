import { NgModule } from "@angular/core";
import { CoreModule } from "../../_core/core.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppGridViewModule } from "../../_core/_components/app-grid-view/app-grid-view.module";
import { AppFormModule } from "../../_core/_components/app-form/app-form.module";
import { EstabelecimentoComponent } from "./estabelecimento.component";
import { EstabelecimentoFormComponent } from "./estabelecimento-form.component";
import { EstabelecimentoService } from "./estabelecimento.service";
import { estabelecimentoRoutes } from "./estabelecimento.routing";

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(estabelecimentoRoutes)
    ],
    declarations: [
        EstabelecimentoComponent,
        EstabelecimentoFormComponent,
    ],
    providers: [
        EstabelecimentoService
    ]
})
export class EstabelecimentoModule {
}