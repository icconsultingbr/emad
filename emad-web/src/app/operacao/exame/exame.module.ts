import { NgModule } from "@angular/core";
import { CoreModule } from "../../_core/core.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppGridViewModule } from "../../_core/_components/app-grid-view/app-grid-view.module";
import { AppFormModule } from "../../_core/_components/app-form/app-form.module";
import { ExameComponent } from "./exame.component";
import { ExameFormComponent } from "./exame-form.component";
import { exameRoutes } from "./exame.routing";
import { PesquisaPacienteModule } from "../../components/pesquisa-pacientes/pesquisa-paciente.module";
import { NgbDatepickerModule } from "@ng-bootstrap/ng-bootstrap/datepicker/datepicker.module";
import { NgbCollapseModule } from "@ng-bootstrap/ng-bootstrap/collapse/collapse.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { PesquisaMedicamentoModule } from "../../components/pesquisa-medicamentos/pesquisa-medicamento.module";
import { SharedServiceModule } from "../../shared/services/shared-service.module";
import { AppFileUploadModule } from "../../_core/_components/app-file-upload/app-file-upload.module";

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(exameRoutes),
        PesquisaPacienteModule,
        ReactiveFormsModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        NgbCollapseModule,
        NgbDatepickerModule,
        BsDatepickerModule,
        PesquisaMedicamentoModule,
        SharedServiceModule,
        AppFileUploadModule
    ],
    declarations: [
        ExameComponent,
        ExameFormComponent,
    ],
    providers: [
    ],
    exports: [
        ExameFormComponent
    ]
})
export class ExameModule {
}