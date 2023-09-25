import { NgModule } from '@angular/core';
import { CoreModule } from '../../_core/core.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppGridViewModule } from '../../_core/_components/app-grid-view/app-grid-view.module';
import { AppFormModule } from '../../_core/_components/app-form/app-form.module';
import { ProcedimentoComponent } from './procedimento.component';
import { ProcedimentoFormComponent } from './procedimento-form.component';
import { procedimentoRoutes } from './procedimento.routing';
import { ProcedimentoService } from './procedimento.service';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(procedimentoRoutes)
    ],
    declarations: [
        ProcedimentoComponent,
        ProcedimentoFormComponent,
    ],
    providers: [
        ProcedimentoService
    ]
})
export class ProcedimentoModule {
}
