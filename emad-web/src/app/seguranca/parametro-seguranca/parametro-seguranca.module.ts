import { NgModule } from '@angular/core';
import { CoreModule } from '../../_core/core.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppGridViewModule } from '../../_core/_components/app-grid-view/app-grid-view.module';
import { AppFormModule } from '../../_core/_components/app-form/app-form.module';
import { ParametroSegurancaComponent } from './parametro-seguranca.component';
import { ParametroSegurancaFormComponent } from './parametro-seguranca-form.component';
import { ParametroSegurancaService } from './parametro-seguranca.service';
import { parametroSegurancaRoutes } from './parametro-seguranca.routing';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(parametroSegurancaRoutes)
    ],
    declarations: [
        ParametroSegurancaComponent,
        ParametroSegurancaFormComponent,
    ],
    providers: [
        ParametroSegurancaService
    ]
})
export class ParametroSegurancaModule {
}
