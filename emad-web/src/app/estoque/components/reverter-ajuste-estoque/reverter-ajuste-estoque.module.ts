import { NgModule } from "@angular/core";
import { CoreModule } from "../../../_core/core.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppGridViewModule } from "../../../_core/_components/app-grid-view/app-grid-view.module";
import { AppFormModule } from "../../../_core/_components/app-form/app-form.module";
import { PesquisaMedicamentoModule } from "../../../components/pesquisa-medicamentos/pesquisa-medicamento.module";
import { reverterAjusteEstoqueRoutes } from "./reverter-ajuste-estoque.routing";
import { ReverterAjusteEstoqueFormComponent } from "./reverter-ajuste-estoque-form.component";
import { ReverterAjusteEstoqueService } from "./reverter-ajuste-estoque.service";
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
        RouterModule.forChild(reverterAjusteEstoqueRoutes),
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
        ReverterAjusteEstoqueFormComponent,
    ],
    providers: [
        ReverterAjusteEstoqueService
    ]
})
export class ReverterAjusteEstoqueModule {
}