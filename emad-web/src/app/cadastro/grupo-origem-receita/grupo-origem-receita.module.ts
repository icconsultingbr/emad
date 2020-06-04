import { NgModule } from "@angular/core";
import { CoreModule } from "../../_core/core.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppGridViewModule } from "../../_core/_components/app-grid-view/app-grid-view.module";
import { AppFormModule } from "../../_core/_components/app-form/app-form.module";
import { GrupoOrigemReceitaComponent } from "./grupo-origem-receita.component";
import { GrupoOrigemReceitaFormComponent } from "./grupo-origem-receita-form.component";
import { GrupoOrigemReceitaService } from "./grupo-origem-receita.service";
import { grupoOrigemReceitaRoutes } from "./grupo-origem-receita.routing";

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(grupoOrigemReceitaRoutes)
    ],
    declarations: [
        GrupoOrigemReceitaComponent,
        GrupoOrigemReceitaFormComponent,
    ],
    providers: [
        GrupoOrigemReceitaService
    ]
})
export class GrupoOrigemReceitaModule {
}