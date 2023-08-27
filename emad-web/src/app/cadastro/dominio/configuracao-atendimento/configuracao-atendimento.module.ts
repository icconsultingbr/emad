import { NgModule } from "@angular/core";
import { CoreModule } from "../../../_core/core.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppGridViewModule } from "../../../_core/_components/app-grid-view/app-grid-view.module";
import { AppFormModule } from "../../../_core/_components/app-form/app-form.module";
import { configuracaoAtendimentoRoutes } from "./configuracao-atendimento.routing";
import { ConfiguracaoAtendimentoService } from "./configuracao-atendimento.service";
import { ConfiguracaoAtendimentoComponent } from "./configuracao-atendimento.component";
import { ConfiguracaoAtendimentoFormComponent } from "./configuracao-atendimento-form.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(configuracaoAtendimentoRoutes)
    ],
    declarations: [
        ConfiguracaoAtendimentoComponent,
        ConfiguracaoAtendimentoFormComponent,
    ],
    providers: [
        ConfiguracaoAtendimentoService
    ]
})
export class ConfiguracaoAtendimentoModule {
}