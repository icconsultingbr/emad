import { NgModule } from '@angular/core';
import { CoreModule } from '../../../_core/core.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppGridViewModule } from '../../../_core/_components/app-grid-view/app-grid-view.module';
import { AppFormModule } from '../../../_core/_components/app-form/app-form.module';
import { AlteraValidadeFormComponent } from './altera-validade-form.component';
import { AlteraValidadeService } from './altera-validade.service';
import { alteraValidadeRoutes } from './altera-validade.routing';
import { PesquisaMedicamentoModule } from '../../../components/pesquisa-medicamentos/pesquisa-medicamento.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule, NgbCollapseModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(alteraValidadeRoutes),
        PesquisaMedicamentoModule,
        ReactiveFormsModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        NgbCollapseModule,
        NgbDatepickerModule,
        BsDatepickerModule,
    ],
    declarations: [
        AlteraValidadeFormComponent,
    ],
    providers: [
        AlteraValidadeService
    ]
})
export class AlteraValidadeModule {
}
