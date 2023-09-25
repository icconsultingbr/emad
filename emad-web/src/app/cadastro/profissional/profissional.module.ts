import { NgModule } from '@angular/core';
import { CoreModule } from '../../_core/core.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppGridViewModule } from '../../_core/_components/app-grid-view/app-grid-view.module';
import { AppFormModule } from '../../_core/_components/app-form/app-form.module';
import { ProfissionalComponent } from './profissional.component';
import { ProfissionalFormComponent } from './profissional-form.component';
import { ProfissionalService } from './profissional.service';
import { profissionalRoutes } from './profissional.routing';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(profissionalRoutes)
    ],
    declarations: [
        ProfissionalComponent,
        ProfissionalFormComponent,
    ],
    providers: [
        ProfissionalService
    ]
})
export class ProfissionalModule {
}
