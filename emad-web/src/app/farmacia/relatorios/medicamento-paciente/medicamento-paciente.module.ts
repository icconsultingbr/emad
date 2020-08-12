import { NgModule } from "@angular/core";
import { CoreModule } from "../../../_core/core.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppGridViewModule } from "../../../_core/_components/app-grid-view/app-grid-view.module";
import { AppFormModule } from "../../../_core/_components/app-form/app-form.module";
import { MedicamentoPacienteComponent } from "./medicamento-paciente.component";
import { medicamentoPacienteRoutes } from "./medicamento-paciente.routing";
import { NgbDatepickerModule } from "@ng-bootstrap/ng-bootstrap/datepicker/datepicker.module";
import { NgbCollapseModule } from "@ng-bootstrap/ng-bootstrap/collapse/collapse.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { SharedServiceModule } from "../../../shared/services/shared-service.module";
import { PesquisaPacienteModule } from "../../../components/pesquisa-pacientes/pesquisa-paciente.module";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { PesquisaMedicamentoModule } from "../../../components/pesquisa-medicamentos/pesquisa-medicamento.module";
import { MedicamentoPacienteImpressaoService } from "../../../shared/services/medicamento-paciente.service";
import { MedicamentoPacienteService } from "./medicamento-paciente.service";

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(medicamentoPacienteRoutes),
        ReactiveFormsModule,
        FormsModule,
        ReactiveFormsModule,        
        NgbModule,
        NgbCollapseModule,
        NgbDatepickerModule,
        SharedServiceModule,
        PesquisaPacienteModule,        
        BsDatepickerModule,
        PesquisaMedicamentoModule,
        SharedServiceModule,          
    ],
    declarations: [
        MedicamentoPacienteComponent,
    ],
    providers: [
        MedicamentoPacienteService   
    ]
})
export class MedicamentoPacienteModule {
}