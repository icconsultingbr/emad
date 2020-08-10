import { NgModule } from "@angular/core";
import { CoreModule } from "../../../_core/core.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppGridViewModule } from "../../../_core/_components/app-grid-view/app-grid-view.module";
import { AppFormModule } from "../../../_core/_components/app-form/app-form.module";
import { AtenderRemanejamentoComponent } from "./atender-remanejamento.component";
import { AtenderRemanejamentoFormComponent } from "./atender-remanejamento-form.component";
import { atenderRemanejamentoRoutes } from "./atender-remanejamento.routing";
import { PesquisaMedicamentoModule } from "../../../components/pesquisa-medicamentos/pesquisa-medicamento.module";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgbModule, NgbCollapseModule } from "@ng-bootstrap/ng-bootstrap";
import { SolicitacaoRemanejamentoService } from "../solicitacao-remanejamento/solicitacao-remanejamento.service";

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(atenderRemanejamentoRoutes),
        PesquisaMedicamentoModule,     
        ReactiveFormsModule,
        FormsModule,
        ReactiveFormsModule,        
        NgbModule,
        NgbCollapseModule
    ],
    declarations: [
        AtenderRemanejamentoComponent,
        AtenderRemanejamentoFormComponent,
    ],
    providers: [
        SolicitacaoRemanejamentoService
    ]
})
export class AtenderRemanejamentoModule {
}