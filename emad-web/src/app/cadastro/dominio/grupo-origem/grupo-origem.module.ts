import { NgModule } from '@angular/core';
import { CoreModule } from '../../../_core/core.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppGridViewModule } from '../../../_core/_components/app-grid-view/app-grid-view.module';
import { AppFormModule } from '../../../_core/_components/app-form/app-form.module';
import { GrupoOrigemComponent } from './grupo-origem.component';
import { GrupoOrigemFormComponent } from './grupo-origem-form.component';
import { GrupoOrigemService } from './grupo-origem.service';
import { grupoOrigemRoutes } from './grupo-origem.routing';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(grupoOrigemRoutes)
    ],
    declarations: [
        GrupoOrigemComponent,
        GrupoOrigemFormComponent,
    ],
    providers: [
        GrupoOrigemService
    ]
})
export class GrupoOrigemModule {
}
