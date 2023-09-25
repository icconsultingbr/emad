import { NgModule } from '@angular/core';
import { CoreModule } from '../../../_core/core.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppGridViewModule } from '../../../_core/_components/app-grid-view/app-grid-view.module';
import { AppFormModule } from '../../../_core/_components/app-form/app-form.module';
import { EstoqueMedicamentoComponent } from './estoque-medicamento.component';
import { EstoqueMedicamentoService } from './estoque-medicamento.service';
import { estoqueMedicamentoRoutes } from './estoque-medicamento.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgbModule, NgbCollapseModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AgGridModule } from 'ag-grid-angular';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AppModalModule } from '../../../_core/_components/app-modal/app-modal.module';
import 'rxjs/add/operator/map';
import { PesquisaMedicamentoModule } from '../../../components/pesquisa-medicamentos/pesquisa-medicamento.module';
import { SharedServiceModule } from '../../../shared/services/shared-service.module';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
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
        RouterModule.forChild(estoqueMedicamentoRoutes),
        PesquisaMedicamentoModule,
        SharedServiceModule
    ],
    declarations: [
        EstoqueMedicamentoComponent
    ],
    providers: [
        EstoqueMedicamentoService
    ],
    exports: [
        EstoqueMedicamentoComponent
    ]
})
export class EstoqueMedicamentoModule {
}
