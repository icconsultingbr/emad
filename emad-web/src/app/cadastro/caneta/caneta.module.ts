import { NgModule } from '@angular/core';
import { CoreModule } from '../../_core/core.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppGridViewModule } from '../../_core/_components/app-grid-view/app-grid-view.module';
import { AppFormModule } from '../../_core/_components/app-form/app-form.module';
import { CanetaComponent } from './caneta.component';
import { CanetaFormComponent } from './caneta-form.component';
import { CanetaService } from './caneta.service';
import { canetaRoutes } from './caneta.routing';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(canetaRoutes)
    ],
    declarations: [
        CanetaComponent,
        CanetaFormComponent,
    ],
    providers: [
        CanetaService
    ]
})
export class CanetaModule {
}
