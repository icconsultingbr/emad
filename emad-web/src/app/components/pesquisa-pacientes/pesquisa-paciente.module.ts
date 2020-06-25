import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgbModule, NgbCollapseModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CoreModule } from "../../_core/core.module";
import { PesquisaPacienteComponent } from "./pesquisa-paciente.component";
import { AppGridViewModule } from "../../_core/_components/app-grid-view/app-grid-view.module";
import { AppFormModule } from "../../_core/_components/app-form/app-form.module";
import { AppModalModule } from "../../_core/_components/app-modal/app-modal.module";

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        AppGridViewModule,
        AppFormModule,
        FormsModule,
        ReactiveFormsModule,        
        NgbModule,
        NgbCollapseModule,
        NgbDatepickerModule,
        NgMultiSelectDropDownModule,
        NgMultiSelectDropDownModule.forRoot(),
        CoreModule,
        AppModalModule,
    ],
    declarations: [PesquisaPacienteComponent],
    exports: [PesquisaPacienteComponent]
})

export class PesquisaPacienteModule { }