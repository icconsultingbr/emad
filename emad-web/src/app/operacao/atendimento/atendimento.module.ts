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
import { AgGridModule } from 'ag-grid-angular';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AppModalModule } from "../../_core/_components/app-modal/app-modal.module";
import 'rxjs/add/operator/map';
import { ReciboReceitaImpressaoService } from "../../farmacia/receita/recibo/recibo-receita-impressao.service";
import { ReceitaService } from "../../farmacia/receita/receita.service";

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
        RouterModule.forChild(atendimentoRoutes)      
    ],
    declarations: [
        AtendimentoComponent,
        AtendimentoFormComponent,
    ],
    providers: [
        AtendimentoService,
        ReciboReceitaImpressaoService,
        ReceitaService
    ]
})
export class AtendimentoModule {
}