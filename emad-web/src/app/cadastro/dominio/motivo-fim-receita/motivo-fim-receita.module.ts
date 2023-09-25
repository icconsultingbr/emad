import { NgModule } from '@angular/core';
import { CoreModule } from '../../../_core/core.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppGridViewModule } from '../../../_core/_components/app-grid-view/app-grid-view.module';
import { AppFormModule } from '../../../_core/_components/app-form/app-form.module';
import { MotivoFimReceitaComponent } from './motivo-fim-receita.component';
import { MotivoFimReceitaFormComponent } from './motivo-fim-receita-form.component';
import { MotivoFimReceitaService } from './motivo-fim-receita.service';
import { motivoFimReceitaRoutes } from './motivo-fim-receita.routing';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(motivoFimReceitaRoutes)
    ],
    declarations: [
        MotivoFimReceitaComponent,
        MotivoFimReceitaFormComponent,
    ],
    providers: [
        MotivoFimReceitaService
    ]
})
export class MotivoFimReceitaModule {
}
