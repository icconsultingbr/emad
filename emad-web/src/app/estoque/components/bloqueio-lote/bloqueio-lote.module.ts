import { NgModule } from '@angular/core';
import { CoreModule } from '../../../_core/core.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppGridViewModule } from '../../../_core/_components/app-grid-view/app-grid-view.module';
import { AppFormModule } from '../../../_core/_components/app-form/app-form.module';
import { BloqueioLoteComponent } from './bloqueio-lote.component';
import { BloqueioLoteFormComponent } from './bloqueio-lote-form.component';
import { BloqueioLoteService } from './bloqueio-lote.service';
import { bloqueioLoteRoutes } from './bloqueio-lote.routing';
import { PesquisaMedicamentoModule } from '../../../components/pesquisa-medicamentos/pesquisa-medicamento.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(bloqueioLoteRoutes),
        PesquisaMedicamentoModule,
        ReactiveFormsModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        NgbCollapseModule
    ],
    declarations: [
        BloqueioLoteComponent,
        BloqueioLoteFormComponent,
    ],
    providers: [
        BloqueioLoteService
    ]
})
export class BloqueioLoteModule {
}
