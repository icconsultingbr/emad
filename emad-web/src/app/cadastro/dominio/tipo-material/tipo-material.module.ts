import { NgModule } from '@angular/core';
import { CoreModule } from '../../../_core/core.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppGridViewModule } from '../../../_core/_components/app-grid-view/app-grid-view.module';
import { AppFormModule } from '../../../_core/_components/app-form/app-form.module';
import { TipoMaterialComponent } from './tipo-material.component';
import { TipoMaterialFormComponent } from './tipo-material-form.component';
import { TipoMaterialService } from './tipo-material.service';
import { tipoMaterialRoutes } from './tipo-material.routing';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(tipoMaterialRoutes)
    ],
    declarations: [
        TipoMaterialComponent,
        TipoMaterialFormComponent,
    ],
    providers: [
        TipoMaterialService
    ]
})
export class TipoMaterialModule {
}
