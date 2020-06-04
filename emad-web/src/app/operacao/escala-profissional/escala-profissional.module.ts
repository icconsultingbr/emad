import { NgModule } from "@angular/core";
import { CoreModule } from "../../_core/core.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppGridViewModule } from "../../_core/_components/app-grid-view/app-grid-view.module";
import { AppFormModule } from "../../_core/_components/app-form/app-form.module";
import { EscalaProfissionalFormComponent } from "./escala-profissional-form.component";
import { EscalaProfissionalService } from "./escala-profissional.service";
import { escalaProfissionalRoutes } from "./escala-profissional.routing";
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
        RouterModule.forChild(escalaProfissionalRoutes)
    ],
    declarations: [
        EscalaProfissionalFormComponent,
    ],
    providers: [
        EscalaProfissionalService
    ]
})
export class EscalaProfissionalModule {
}