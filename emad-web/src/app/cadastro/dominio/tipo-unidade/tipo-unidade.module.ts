import { NgModule } from '@angular/core';
import { CoreModule } from '../../../_core/core.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppGridViewModule } from '../../../_core/_components/app-grid-view/app-grid-view.module';
import { AppFormModule } from '../../../_core/_components/app-form/app-form.module';
import { TipoUnidadeComponent } from './tipo-unidade.component';
import { TipoUnidadeFormComponent } from './tipo-unidade-form.component';
import { TipoUnidadeService } from './tipo-unidade.service';
import { tipoUnidadeRoutes } from './tipo-unidade.routing';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(tipoUnidadeRoutes)
    ],
    declarations: [
        TipoUnidadeComponent,
        TipoUnidadeFormComponent,
    ],
    providers: [
        TipoUnidadeService
    ]
})
export class TipoUnidadeModule {
}
