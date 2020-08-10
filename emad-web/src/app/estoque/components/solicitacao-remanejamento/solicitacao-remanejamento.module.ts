import { NgModule } from "@angular/core";
import { CoreModule } from "../../../_core/core.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppGridViewModule } from "../../../_core/_components/app-grid-view/app-grid-view.module";
import { AppFormModule } from "../../../_core/_components/app-form/app-form.module";
import { SolicitacaoRemanejamentoComponent } from "./solicitacao-remanejamento.component";
import { SolicitacaoRemanejamentoFormComponent } from "./solicitacao-remanejamento-form.component";
import { SolicitacaoRemanejamentoService } from "./solicitacao-remanejamento.service";
import { solicitacaoRemanejamentoRoutes } from "./solicitacao-remanejamento.routing";
import { PesquisaMedicamentoModule } from "../../../components/pesquisa-medicamentos/pesquisa-medicamento.module";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgbModule, NgbCollapseModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(solicitacaoRemanejamentoRoutes),
        PesquisaMedicamentoModule,     
        ReactiveFormsModule,
        FormsModule,
        ReactiveFormsModule,        
        NgbModule,
        NgbCollapseModule
    ],
    declarations: [
        SolicitacaoRemanejamentoComponent,
        SolicitacaoRemanejamentoFormComponent,
    ],
    providers: [
        SolicitacaoRemanejamentoService
    ]
})
export class SolicitacaoRemanejamentoModule {
}