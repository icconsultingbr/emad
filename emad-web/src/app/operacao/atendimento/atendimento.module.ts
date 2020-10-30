import { NgModule } from "@angular/core";
import { CoreModule } from "../../_core/core.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppGridViewModule } from "../../_core/_components/app-grid-view/app-grid-view.module";
import { AppFormModule } from "../../_core/_components/app-form/app-form.module";
import { AtendimentoComponent } from "./atendimento.component";
import { AtendimentoFormComponent } from "./atendimento-form.component";
import { AtendimentoService } from "./atendimento.service";
import { atendimentoRoutes } from "./atendimento.routing";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgbModule, NgbCollapseModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AppModalModule } from "../../_core/_components/app-modal/app-modal.module";
import 'rxjs/add/operator/map';
import { SharedServiceModule } from "../../shared/services/shared-service.module";
import { RelatorioReceitaComponent } from "./relatorio-receita.component";
import { TabsModule } from "ngx-bootstrap/tabs";
import { AtendimentoSalaEsperaFormComponent } from "./sala-espera/atendimento-sala-espera-form.component";
import { AtendimentoSalaEsperaComponent } from "./sala-espera/atendimento-sala-espera.component";
import { AppSelectModule } from "../../_core/_components/app-select/app-select.module";
import { AppSelectModalModule } from "../../_core/_components/app-select-modal/app-select-modal.module";

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
        AppModalModule,
        RouterModule.forChild(atendimentoRoutes),
        SharedServiceModule,
        TabsModule.forRoot(),
        AppSelectModule,
        AppSelectModalModule
    ],
    declarations: [
        AtendimentoComponent,
        AtendimentoSalaEsperaComponent,
        AtendimentoFormComponent,
        AtendimentoSalaEsperaFormComponent,
        RelatorioReceitaComponent
    ],
    providers: [
        AtendimentoService
    ]
})
export class AtendimentoModule {
}