import { NgModule } from "@angular/core";
import { CoreModule } from "../../../_core/core.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppGridViewModule } from "../../../_core/_components/app-grid-view/app-grid-view.module";
import { AppFormModule } from "../../../_core/_components/app-form/app-form.module";
import { PesquisaMedicamentoModule } from "../../../components/pesquisa-medicamentos/pesquisa-medicamento.module";
import { ajusteEstoqueRoutes } from "./ajuste-estoque.routing";
import { AjusteEstoqueFormComponent } from "./ajuste-estoque-form.component";
import { AjusteEstoqueService } from "./ajuste-estoque.service";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { NgbDatepickerModule, NgbCollapseModule, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { SharedServiceModule } from "../../../shared/services/shared-service.module";

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(ajusteEstoqueRoutes),
        PesquisaMedicamentoModule,     
        ReactiveFormsModule,
        FormsModule,
        ReactiveFormsModule,        
        NgbModule,
        NgbCollapseModule,
        NgbDatepickerModule,
        BsDatepickerModule,   
        SharedServiceModule     
    ],
    declarations: [
        AjusteEstoqueFormComponent,
    ],
    providers: [
        AjusteEstoqueService
    ]
})
export class AjusteEstoqueModule {
}