import { NgModule } from '@angular/core';
import { CoreModule } from '../../_core/core.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppGridViewModule } from '../../_core/_components/app-grid-view/app-grid-view.module';
import { AppFormModule } from '../../_core/_components/app-form/app-form.module';
import { EspecialidadeEntidadeCampoFormComponent } from './especialidade-entidade-campo-form.component';
import { EspecialidadeEntidadeCampoService } from './especialidade-entidade-campo.service';
import { especialidadeEntidadeCampoRoutes } from './especialidade-entidade-campo.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(especialidadeEntidadeCampoRoutes)
    ],
    declarations: [
        EspecialidadeEntidadeCampoFormComponent,
    ],
    providers: [
        EspecialidadeEntidadeCampoService
    ]
})
export class EspecialidadeEntidadeCampoModule {
}
