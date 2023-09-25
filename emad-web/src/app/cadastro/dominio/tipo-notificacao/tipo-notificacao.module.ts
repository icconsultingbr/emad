import { NgModule } from '@angular/core';
import { CoreModule } from '../../../_core/core.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppGridViewModule } from '../../../_core/_components/app-grid-view/app-grid-view.module';
import { AppFormModule } from '../../../_core/_components/app-form/app-form.module';
import { TipoNotificacaoComponent } from './tipo-notificacao.component';
import { TipoNotificacaoFormComponent } from './tipo-notificacao-form.component';
import { TipoNotificacaoService } from './tipo-notificacao.service';
import { tipoNotificacaoRoutes } from './tipo-notificacao.routing';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(tipoNotificacaoRoutes)
    ],
    declarations: [
        TipoNotificacaoComponent,
        TipoNotificacaoFormComponent,
    ],
    providers: [
        TipoNotificacaoService
    ]
})
export class TipoNotificacaoModule {
}
