import { NgModule } from '@angular/core';
import { CoreModule } from '../../_core/core.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppGridViewModule } from '../../_core/_components/app-grid-view/app-grid-view.module';
import { AppFormModule } from '../../_core/_components/app-form/app-form.module';
import { FabricanteMaterialComponent } from './fabricante-material.component';
import { FabricanteMaterialFormComponent } from './fabricante-material-form.component';
import { FabricanteMaterialService } from './fabricante-material.service';
import { fabricanteMaterialRoutes } from './fabricante-material.routing';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(fabricanteMaterialRoutes)
    ],
    declarations: [
        FabricanteMaterialComponent,
        FabricanteMaterialFormComponent,
    ],
    providers: [
        FabricanteMaterialService
    ]
})
export class FabricanteMaterialModule {
}
