import { NgModule } from '@angular/core';
import { CoreModule } from '../../../_core/core.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppGridViewModule } from '../../../_core/_components/app-grid-view/app-grid-view.module';
import { AppFormModule } from '../../../_core/_components/app-form/app-form.module';
import { AtencaoContinuadaComponent } from './atencao-continuada.component';
import { AtencaoContinuadaFormComponent } from './atencao-continuada-form.component';
import { AtencaoContinuadaService } from './atencao-continuada.service';
import { atencaoContinuadaRoutes } from './atencao-continuada.routing';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(atencaoContinuadaRoutes)
    ],
    declarations: [
        AtencaoContinuadaComponent,
        AtencaoContinuadaFormComponent,
    ],
    providers: [
        AtencaoContinuadaService
    ]
})
export class AtencaoContinuadaModule {
}
