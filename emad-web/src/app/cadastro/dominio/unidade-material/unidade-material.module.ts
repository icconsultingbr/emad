import { NgModule } from '@angular/core';
import { CoreModule } from '../../../_core/core.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppGridViewModule } from '../../../_core/_components/app-grid-view/app-grid-view.module';
import { AppFormModule } from '../../../_core/_components/app-form/app-form.module';
import { UnidadeMaterialComponent } from './unidade-material.component';
import { UnidadeMaterialFormComponent } from './unidade-material-form.component';
import { UnidadeMaterialService } from './unidade-material.service';
import { unidadeMaterialRoutes } from './unidade-material.routing';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(unidadeMaterialRoutes)
    ],
    declarations: [
        UnidadeMaterialComponent,
        UnidadeMaterialFormComponent,
    ],
    providers: [
        UnidadeMaterialService
    ]
})
export class UnidadeMaterialModule {
}
