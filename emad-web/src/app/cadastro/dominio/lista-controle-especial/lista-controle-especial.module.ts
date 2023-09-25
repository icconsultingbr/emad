import { NgModule } from '@angular/core';
import { CoreModule } from '../../../_core/core.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppGridViewModule } from '../../../_core/_components/app-grid-view/app-grid-view.module';
import { AppFormModule } from '../../../_core/_components/app-form/app-form.module';
import { ListaControleEspecialComponent } from './lista-controle-especial.component';
import { ListaControleEspecialFormComponent } from './lista-controle-especial-form.component';
import { ListaControleEspecialService } from './lista-controle-especial.service';
import { listaControleEspecialRoutes } from './lista-controle-especial.routing';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(listaControleEspecialRoutes)
    ],
    declarations: [
        ListaControleEspecialComponent,
        ListaControleEspecialFormComponent,
    ],
    providers: [
        ListaControleEspecialService
    ]
})
export class ListaControleEspecialModule {
}
