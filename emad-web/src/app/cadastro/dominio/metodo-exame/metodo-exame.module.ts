import { NgModule } from '@angular/core';
import { CoreModule } from '../../../_core/core.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppGridViewModule } from '../../../_core/_components/app-grid-view/app-grid-view.module';
import { AppFormModule } from '../../../_core/_components/app-form/app-form.module';
import { MetodoExameComponent } from './metodo-exame.component';
import { MetodoExameFormComponent } from './metodo-exame-form.component';
import { MetodoExameService } from './metodo-exame.service';
import { metodoExameRoutes } from './metodo-exame.routing';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(metodoExameRoutes)
    ],
    declarations: [
        MetodoExameComponent,
        MetodoExameFormComponent,
    ],
    providers: [
        MetodoExameService
    ]
})
export class MetodoExameModule {
}
