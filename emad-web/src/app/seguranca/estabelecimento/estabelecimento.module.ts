import { NgModule } from '@angular/core';
import { CoreModule } from '../../_core/core.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppGridViewModule } from '../../_core/_components/app-grid-view/app-grid-view.module';
import { AppFormModule } from '../../_core/_components/app-form/app-form.module';
import { EstabelecimentoComponent } from './estabelecimento.component';
import { EstabelecimentoFormComponent } from './estabelecimento-form.component';
import { EstabelecimentoService } from './estabelecimento.service';
import { estabelecimentoRoutes } from './estabelecimento.routing';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgbModule, NgbCollapseModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { AppModalModule } from '../../_core/_components/app-modal/app-modal.module';
import 'rxjs/add/operator/map';
import { SharedServiceModule } from '../../shared/services/shared-service.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TipoFichaService } from '../../cadastro/dominio/tipo-ficha/tipo-ficha.service';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(estabelecimentoRoutes),
        FormsModule,
        ReactiveFormsModule,
        BsDatepickerModule,
        NgbModule,
        NgbCollapseModule,
        NgbDatepickerModule,
        AppModalModule,
        SharedServiceModule,
        RouterModule,
        NgMultiSelectDropDownModule,
        TabsModule.forRoot(),
    ],
    declarations: [
        EstabelecimentoComponent,
        EstabelecimentoFormComponent,
    ],
    providers: [
        EstabelecimentoService,
        TipoFichaService
    ]
})
export class EstabelecimentoModule {
}
