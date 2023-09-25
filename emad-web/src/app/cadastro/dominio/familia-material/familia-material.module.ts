import { NgModule } from '@angular/core';
import { CoreModule } from '../../../_core/core.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppGridViewModule } from '../../../_core/_components/app-grid-view/app-grid-view.module';
import { AppFormModule } from '../../../_core/_components/app-form/app-form.module';
import { FamiliaMaterialComponent } from './familia-material.component';
import { FamiliaMaterialFormComponent } from './familia-material-form.component';
import { FamiliaMaterialService } from './familia-material.service';
import { familiaMaterialRoutes } from './familia-material.routing';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(familiaMaterialRoutes)
    ],
    declarations: [
        FamiliaMaterialComponent,
        FamiliaMaterialFormComponent,
    ],
    providers: [
        FamiliaMaterialService
    ]
})
export class FamiliaMaterialModule {
}
