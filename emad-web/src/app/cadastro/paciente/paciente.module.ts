import { NgModule } from "@angular/core";
import { CoreModule } from "../../_core/core.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppGridViewModule } from "../../_core/_components/app-grid-view/app-grid-view.module";
import { AppFormModule } from "../../_core/_components/app-form/app-form.module";
import { PacienteComponent } from "./paciente.component";
import { PacienteFormComponent } from "./paciente-form.component";
import { PacienteService } from "./paciente.service";
import { pacienteRoutes } from "./paciente.routing";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgbModule, NgbCollapseModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AppModalModule } from "../../_core/_components/app-modal/app-modal.module";
import 'rxjs/add/operator/map';
import { SharedServiceModule } from "../../shared/services/shared-service.module";
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ProntuarioPacienteFormComponent } from "./prontuario-paciente/prontuario-paciente-form.component";
import { AppSelectModule } from "../../_core/_components/app-select/app-select.module";
import { AppSelectModalModule } from "../../_core/_components/app-select-modal/app-select-modal.module";
import { AppImageCropperUploadModule } from "../../_core/_components/app-image-cropper-upload/app-image-cropper-upload.module";
import { ChartsModule } from "ng2-charts";
import { AtendimentoService } from "../../operacao/atendimento/atendimento.service";

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
        RouterModule.forChild(pacienteRoutes),
        SharedServiceModule,
        RouterModule,
        NgMultiSelectDropDownModule.forRoot(),
        TabsModule.forRoot(),
        AppSelectModule,
        AppSelectModalModule,
        AppImageCropperUploadModule,
        ChartsModule
    ],
    declarations: [
        PacienteComponent,
        PacienteFormComponent,
        ProntuarioPacienteFormComponent
    ],
    providers: [
        PacienteService,
        AtendimentoService
    ]
})
export class PacienteModule {
}
