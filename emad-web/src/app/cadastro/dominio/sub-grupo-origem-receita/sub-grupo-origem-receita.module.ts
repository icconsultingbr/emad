import { NgModule } from '@angular/core';
import { CoreModule } from '../../../_core/core.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppGridViewModule } from '../../../_core/_components/app-grid-view/app-grid-view.module';
import { AppFormModule } from '../../../_core/_components/app-form/app-form.module';
import { SubGrupoOrigemReceitaComponent } from './sub-grupo-origem-receita.component';
import { SubGrupoOrigemReceitaFormComponent } from './sub-grupo-origem-receita-form.component';
import { SubGrupoOrigemReceitaService } from './sub-grupo-origem-receita.service';
import { subGrupoOrigemReceitaRoutes } from './sub-grupo-origem-receita.routing';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(subGrupoOrigemReceitaRoutes)
    ],
    declarations: [
        SubGrupoOrigemReceitaComponent,
        SubGrupoOrigemReceitaFormComponent,
    ],
    providers: [
        SubGrupoOrigemReceitaService
    ]
})
export class SubGrupoOrigemReceitaModule {
}
