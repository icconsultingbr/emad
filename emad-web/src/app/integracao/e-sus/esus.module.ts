import { NgModule } from "@angular/core";
import { CoreModule } from "../../_core/core.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppGridViewModule } from "../../_core/_components/app-grid-view/app-grid-view.module";
import { AppFormModule } from "../../_core/_components/app-form/app-form.module";
import { ESusComponent } from "./esus.component";
import { esusRoutes } from "./esus.routing";
import { NgbDatepickerModule } from "@ng-bootstrap/ng-bootstrap/datepicker/datepicker.module";
import { NgbCollapseModule } from "@ng-bootstrap/ng-bootstrap/collapse/collapse.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { SharedServiceModule } from "../../shared/services/shared-service.module";

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(esusRoutes),
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
        ESusComponent,
    ],
    providers: [
    ]
})
export class ESusModule {
}