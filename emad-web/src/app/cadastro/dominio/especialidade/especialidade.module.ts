import { NgModule } from '@angular/core';
import { EspecialidadeComponent } from './especialidade.component';
import { EspecialidadeFormComponent } from './especialidade-form.component';
import { EspecialidadeService } from './especialidade.service';
import { CoreModule } from '../../../_core/core.module';
import { RouterModule } from '@angular/router';
import { especiadadeRoutes } from './especialidade.routing';
import { CommonModule } from '@angular/common';
import { AppGridViewModule } from '../../../_core/_components/app-grid-view/app-grid-view.module';
import { AppFormModule } from '../../../_core/_components/app-form/app-form.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(especiadadeRoutes)
    ],
    declarations: [
        EspecialidadeComponent,
        EspecialidadeFormComponent,
    ],
    providers: [
        EspecialidadeService
    ]
})
export class EspecialidadeModule {
}
