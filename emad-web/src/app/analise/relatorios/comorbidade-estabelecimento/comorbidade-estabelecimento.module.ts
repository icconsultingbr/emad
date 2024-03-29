import { NgModule } from '@angular/core';
import { CoreModule } from '../../../_core/core.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppGridViewModule } from '../../../_core/_components/app-grid-view/app-grid-view.module';
import { AppFormModule } from '../../../_core/_components/app-form/app-form.module';
import { ComorbidadeEstabelecimentoComponent } from './comorbidade-estabelecimento.component';
import { ComorbidadeEstabelecimentoService } from './comorbidade-estabelecimento.service';
import { comorbidadeEstabelecimentoRoutes } from './comorbidade-estabelecimento.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgbModule, NgbCollapseModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AgGridModule } from 'ag-grid-angular';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AppModalModule } from '../../../_core/_components/app-modal/app-modal.module';
import 'rxjs/add/operator/map';
import { SharedServiceModule } from '../../../shared/services/shared-service.module';
import { ComorbidadeEstabelecimentoImpressaoService } from '../../../shared/services/comorbidade-estabelecimento-impressao.service';

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
        RouterModule.forChild(comorbidadeEstabelecimentoRoutes),
        SharedServiceModule
    ],
    declarations: [
        ComorbidadeEstabelecimentoComponent
    ],
    providers: [
        ComorbidadeEstabelecimentoService,
        ComorbidadeEstabelecimentoImpressaoService
    ],
    exports: [
        ComorbidadeEstabelecimentoComponent
    ]
})
export class ComorbidadeEstabelecimentoModule {
}
