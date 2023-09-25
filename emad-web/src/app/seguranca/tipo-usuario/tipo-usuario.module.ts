import { NgModule } from '@angular/core';
import { CoreModule } from '../../_core/core.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppGridViewModule } from '../../_core/_components/app-grid-view/app-grid-view.module';
import { AppFormModule } from '../../_core/_components/app-form/app-form.module';
import { TipoUsuarioComponent } from './tipo-usuario.component';
import { TipoUsuarioFormComponent } from './tipo-usuario-form.component';
import { TipoUsuarioService } from './tipo-usuario.service';
import { tipoUsuarioRoutes } from './tipo-usuario.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        FormsModule,
        ReactiveFormsModule,
        NgMultiSelectDropDownModule,
        RouterModule.forChild(tipoUsuarioRoutes)
    ],
    declarations: [
        TipoUsuarioComponent,
        TipoUsuarioFormComponent,
    ],
    providers: [
        TipoUsuarioService
    ]
})
export class TipoUsuarioModule {
}
