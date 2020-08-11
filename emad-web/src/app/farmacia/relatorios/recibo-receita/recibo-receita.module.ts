import { NgModule } from "@angular/core";
import { CoreModule } from "../../../_core/core.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppGridViewModule } from "../../../_core/_components/app-grid-view/app-grid-view.module";
import { AppFormModule } from "../../../_core/_components/app-form/app-form.module";
import { ReciboReceitaFormComponent } from "./recibo-receita-form.component";
import { reciboReceitaRoutes } from "./recibo-receita.routing";
import { NgbDatepickerModule } from "@ng-bootstrap/ng-bootstrap/datepicker/datepicker.module";
import { NgbCollapseModule } from "@ng-bootstrap/ng-bootstrap/collapse/collapse.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { SharedServiceModule } from "../../../shared/services/shared-service.module";

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(reciboReceitaRoutes),
        ReactiveFormsModule,
        FormsModule,
        ReactiveFormsModule,        
        NgbModule,
        NgbCollapseModule,
        NgbDatepickerModule,
        SharedServiceModule
    ],
    declarations: [
        ReciboReceitaFormComponent,
    ],
    providers: [
    ]
})
export class ReciboReceitaModule {
}