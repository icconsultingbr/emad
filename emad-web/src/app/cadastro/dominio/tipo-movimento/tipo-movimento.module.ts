import { NgModule } from '@angular/core';
import { CoreModule } from '../../../_core/core.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppGridViewModule } from '../../../_core/_components/app-grid-view/app-grid-view.module';
import { AppFormModule } from '../../../_core/_components/app-form/app-form.module';
import { TipoMovimentoComponent } from './tipo-movimento.component';
import { TipoMovimentoFormComponent } from './tipo-movimento-form.component';
import { TipoMovimentoService } from './tipo-movimento.service';
import { tipoMovimentoRoutes } from './tipo-movimento.routing';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(tipoMovimentoRoutes)
    ],
    declarations: [
        TipoMovimentoComponent,
        TipoMovimentoFormComponent,
    ],
    providers: [
        TipoMovimentoService
    ]
})
export class TipoMovimentoModule {
}
