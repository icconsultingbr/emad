import { NgModule } from "@angular/core";
import { CoreModule } from "../../_core/core.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppGridViewModule } from "../../_core/_components/app-grid-view/app-grid-view.module";
import { AppFormModule } from "../../_core/_components/app-form/app-form.module";
import { AtribuicaoCanetaComponent } from "./atribuicao-caneta.component";
import { AtribuicaoCanetaFormComponent } from "./atribuicao-caneta-form.component";
import { AtribuicaoCanetaService } from "./atribuicao-caneta.service";
import { atribuicaoCanetaRoutes } from "./atribuicao-caneta.routing";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        FormsModule,
        ReactiveFormsModule,
        BsDatepickerModule,
        RouterModule.forChild(atribuicaoCanetaRoutes)
    ],
    declarations: [
        AtribuicaoCanetaComponent,
        AtribuicaoCanetaFormComponent,
    ],
    providers: [
        AtribuicaoCanetaService
    ]
})
export class AtribuicaoCanetaModule {
}