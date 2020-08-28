import { NgModule } from "@angular/core";
import { CoreModule } from "../../../_core/core.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppGridViewModule } from "../../../_core/_components/app-grid-view/app-grid-view.module";
import { AppFormModule } from "../../../_core/_components/app-form/app-form.module";
import { MedicamentoLivroControladoComponent } from "./medicamento-livro-controlado.component";
import { medicamentoLivroControladoRoutes } from "./medicamento-livro-controlado.routing";
import { NgbDatepickerModule } from "@ng-bootstrap/ng-bootstrap/datepicker/datepicker.module";
import { NgbCollapseModule } from "@ng-bootstrap/ng-bootstrap/collapse/collapse.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { PesquisaPacienteModule } from "../../../components/pesquisa-pacientes/pesquisa-paciente.module";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { PesquisaMedicamentoModule } from "../../../components/pesquisa-medicamentos/pesquisa-medicamento.module";
import { MedicamentoLivroControladoService } from "./medicamento-livro-controlado.service";
import { RelatorioMedicamentoModule } from "../../../shared/services/relatorio-medicamento.module";

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(medicamentoLivroControladoRoutes),
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
        MedicamentoLivroControladoComponent,
    ],
    providers: [
        MedicamentoLivroControladoService   
    ]
})
export class MedicamentoLivroControladoModule {
}