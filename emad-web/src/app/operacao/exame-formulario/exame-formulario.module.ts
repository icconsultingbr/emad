import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbCollapseModule, NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap';
import { PesquisaMedicamentoModule } from '../../components/pesquisa-medicamentos/pesquisa-medicamento.module';
import { PesquisaPacienteModule } from '../../components/pesquisa-pacientes/pesquisa-paciente.module';
import { SharedServiceModule } from '../../shared/services/shared-service.module';
import { CoreModule } from '../../_core/core.module';
import { AppFormModule } from '../../_core/_components/app-form/app-form.module';
import { AppGridViewModule } from '../../_core/_components/app-grid-view/app-grid-view.module';
import { ExameFormularioComponent } from './formulario/exame-formulario.component';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        PesquisaPacienteModule,
        ReactiveFormsModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        NgbCollapseModule,
        NgbDatepickerModule,
        BsDatepickerModule,
        PesquisaMedicamentoModule,
        SharedServiceModule
    ],
    declarations: [
        ExameFormularioComponent,
    ],
    providers: [
    ],
    exports: [
        ExameFormularioComponent
    ]
})
export class ExameFormularioModule {
}
