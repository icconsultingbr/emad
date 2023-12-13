import { NgModule } from '@angular/core';
import { CoreModule } from '../../_core/core.module';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { AppGridViewModule } from '../../_core/_components/app-grid-view/app-grid-view.module';
import { AppFormModule } from '../../_core/_components/app-form/app-form.module';
import { PlanoTerapeuticoComponent } from './plano-terapeutico.component';
import { PlanoTerapeuticoService } from './plano-terapeutico.service';
import { planoTerapeuticoRoutes } from './plano-terapeutico.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgbModule, NgbCollapseModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AgGridModule } from 'ag-grid-angular';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AppModalModule } from '../../_core/_components/app-modal/app-modal.module';
import 'rxjs/add/operator/map';
import { AgendaModule } from '../agenda/agenda.module';
import { AgendamentoModule } from './agendamento/agendamento.module';

@NgModule({
    imports: [
        CoreModule,
        CommonModule,
        AppGridViewModule,
        AppFormModule,
        FormsModule,
        ReactiveFormsModule,
        BsDatepickerModule,
        NgbModule,
        NgbCollapseModule,
        NgbDatepickerModule,
        NgMultiSelectDropDownModule,
        AgGridModule,
        BsDropdownModule,
        AppModalModule,
        RouterModule.forChild(planoTerapeuticoRoutes),
        AgendamentoModule,
    ],
    declarations: [
        PlanoTerapeuticoComponent
    ],
    providers: [
        PlanoTerapeuticoService
    ],
    exports: [
        PlanoTerapeuticoComponent
    ]
})
export class PlanoTerapeuticoModule {
}
