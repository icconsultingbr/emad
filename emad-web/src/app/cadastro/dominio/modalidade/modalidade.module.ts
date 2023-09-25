import { NgModule } from '@angular/core';
import { CoreModule } from '../../../_core/core.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppGridViewModule } from '../../../_core/_components/app-grid-view/app-grid-view.module';
import { AppFormModule } from '../../../_core/_components/app-form/app-form.module';
import { ModalidadeComponent } from './modalidade.component';
import { ModalidadeFormComponent } from './modalidade-form.component';
import { ModalidadeService } from './modalidade.service';
import { modalidadeRoutes } from './modalidade.routing';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(modalidadeRoutes)
    ],
    declarations: [
        ModalidadeComponent,
        ModalidadeFormComponent,
    ],
    providers: [
        ModalidadeService
    ]
})
export class ModalidadeModule {
}
