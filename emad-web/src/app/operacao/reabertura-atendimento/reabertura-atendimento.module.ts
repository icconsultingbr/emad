import { NgModule } from '@angular/core';
import { CoreModule } from '../../_core/core.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppGridViewModule } from '../../_core/_components/app-grid-view/app-grid-view.module';
import { AppFormModule } from '../../_core/_components/app-form/app-form.module';
import { ReaberturaAtendimentoComponent } from './reabertura-atendimento.component';
import { reaberturaAtendimentoRoutes } from './reabertura-atendimento.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AtendimentoService } from '../atendimento/atendimento.service';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        FormsModule,
        ReactiveFormsModule,
        BsDatepickerModule,
        RouterModule.forChild(reaberturaAtendimentoRoutes)
    ],
    declarations: [
        ReaberturaAtendimentoComponent,
    ],
    providers: [
        AtendimentoService
    ]
})
export class ReaberturaAtendimentoModule {
}
