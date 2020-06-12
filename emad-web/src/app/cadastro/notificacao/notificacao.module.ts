import { NgModule } from "@angular/core";
import { CoreModule } from "../../_core/core.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppGridViewModule } from "../../_core/_components/app-grid-view/app-grid-view.module";
import { AppFormModule } from "../../_core/_components/app-form/app-form.module";
import { NotificacaoComponent } from "./notificacao.component";
import { NotificacaoFormComponent } from "./notificacao-form.component";
import { NotificacaoService } from "./notificacao.service";
import { notificacaoRoutes } from "./notificacao.routing";

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(notificacaoRoutes)
    ],
    declarations: [
        NotificacaoComponent,
        NotificacaoFormComponent,
    ],
    providers: [
        NotificacaoService
    ]
})
export class NotificacaoModule {
}