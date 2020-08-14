import { NgModule } from "@angular/core";
import { CoreModule } from "../../../_core/core.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppGridViewModule } from "../../../_core/_components/app-grid-view/app-grid-view.module";
import { AppFormModule } from "../../../_core/_components/app-form/app-form.module";
import { MedicamentoAjusteEstoqueComponent } from "./medicamento-ajuste-estoque.component";
import { medicamentoAjusteEstoqueRoutes } from "./medicamento-ajuste-estoque.routing";
import { NgbDatepickerModule } from "@ng-bootstrap/ng-bootstrap/datepicker/datepicker.module";
import { NgbCollapseModule } from "@ng-bootstrap/ng-bootstrap/collapse/collapse.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { PesquisaPacienteModule } from "../../../components/pesquisa-pacientes/pesquisa-paciente.module";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { PesquisaMedicamentoModule } from "../../../components/pesquisa-medicamentos/pesquisa-medicamento.module";
import { MedicamentoAjusteEstoqueService } from "./medicamento-ajuste-estoque.service";
import { RelatorioMedicamentoModule } from "../../../shared/services/relatorio-medicamento.module";

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(medicamentoAjusteEstoqueRoutes),
        ReactiveFormsModule,
        FormsModule,
        ReactiveFormsModule,        
        NgbModule,
        NgbCollapseModule,
        NgbDatepickerModule,
        PesquisaPacienteModule,        
        BsDatepickerModule,
        PesquisaMedicamentoModule,
        RelatorioMedicamentoModule          
    ],
    declarations: [
        MedicamentoAjusteEstoqueComponent,
    ],
    providers: [
        MedicamentoAjusteEstoqueService   
    ]
})
export class MedicamentoAjusteEstoqueModule {
}