import { NgModule } from '@angular/core';
import { CoreModule } from '../../../_core/core.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppGridViewModule } from '../../../_core/_components/app-grid-view/app-grid-view.module';
import { AppFormModule } from '../../../_core/_components/app-form/app-form.module';
import { GeneroComponent } from './genero.component';
import { GeneroFormComponent } from './genero-form.component';
import { GeneroService } from './genero.service';
import { generoRoutes } from './genero.routing';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(generoRoutes)
    ],
    declarations: [
        GeneroComponent,
        GeneroFormComponent,
    ],
    providers: [
        GeneroService
    ]
})
export class GeneroModule {
}
