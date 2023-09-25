import { NgModule } from '@angular/core';
import { CoreModule } from '../../../_core/core.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppGridViewModule } from '../../../_core/_components/app-grid-view/app-grid-view.module';
import { AppFormModule } from '../../../_core/_components/app-form/app-form.module';
import { ClassificacaoRiscoComponent } from './classificacao-risco.component';
import { ClassificacaoRiscoFormComponent } from './classificacao-risco-form.component';
import { ClassificacaoRiscoService } from './classificacao-risco.service';
import { classificacaoRiscoRoutes } from './classificacao-risco.routing';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(classificacaoRiscoRoutes)
    ],
    declarations: [
        ClassificacaoRiscoComponent,
        ClassificacaoRiscoFormComponent,
    ],
    providers: [
        ClassificacaoRiscoService
    ]
})
export class ClassificacaoRiscoModule {
}
