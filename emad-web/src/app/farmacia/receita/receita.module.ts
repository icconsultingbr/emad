import { NgModule } from "@angular/core";
import { CoreModule } from "../../_core/core.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppGridViewModule } from "../../_core/_components/app-grid-view/app-grid-view.module";
import { AppFormModule } from "../../_core/_components/app-form/app-form.module";
import { ReceitaComponent } from "./receita.component";
import { ReceitaFormComponent } from "./receita-form.component";
import { ReceitaService } from "./receita.service";
import { receitaRoutes } from "./receita.routing";
import { PesquisaPacienteModule } from "../../components/pesquisa-pacientes/pesquisa-paciente.module";
import { NgbDatepickerModule } from "@ng-bootstrap/ng-bootstrap/datepicker/datepicker.module";
import { NgbCollapseModule } from "@ng-bootstrap/ng-bootstrap/collapse/collapse.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { PesquisaMedicamentoModule } from "../../components/pesquisa-medicamentos/pesquisa-medicamento.module";

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(receitaRoutes),
        PesquisaPacienteModule,        
        ReactiveFormsModule,
        FormsModule,
        ReactiveFormsModule,        
        NgbModule,
        NgbCollapseModule,
        NgbDatepickerModule,
        BsDatepickerModule,
        PesquisaMedicamentoModule
    ],
    declarations: [
        ReceitaComponent,
        ReceitaFormComponent,
    ],
    providers: [
        ReceitaService
    ]
})
export class ReceitaModule {
}