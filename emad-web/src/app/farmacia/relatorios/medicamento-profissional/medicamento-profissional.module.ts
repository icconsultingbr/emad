import { NgModule } from "@angular/core";
import { CoreModule } from "../../../_core/core.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppGridViewModule } from "../../../_core/_components/app-grid-view/app-grid-view.module";
import { AppFormModule } from "../../../_core/_components/app-form/app-form.module";
import { MedicamentoProfissionalComponent } from "./medicamento-profissional.component";
import { medicamentoProfissionalRoutes } from "./medicamento-profissional.routing";
import { NgbDatepickerModule } from "@ng-bootstrap/ng-bootstrap/datepicker/datepicker.module";
import { NgbCollapseModule } from "@ng-bootstrap/ng-bootstrap/collapse/collapse.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { SharedServiceModule } from "../../../shared/services/shared-service.module";
import { PesquisaPacienteModule } from "../../../components/pesquisa-pacientes/pesquisa-paciente.module";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { PesquisaMedicamentoModule } from "../../../components/pesquisa-medicamentos/pesquisa-medicamento.module";
import { MedicamentoProfissionalService } from "./medicamento-profissional.service";

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(medicamentoProfissionalRoutes),
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
        MedicamentoProfissionalComponent,
    ],
    providers: [
        MedicamentoProfissionalService   
    ]
})
export class MedicamentoProfissionalModule {
}