import { NgModule } from "@angular/core";
import { CoreModule } from "../../_core/core.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppGridViewModule } from "../../_core/_components/app-grid-view/app-grid-view.module";
import { AppFormModule } from "../../_core/_components/app-form/app-form.module";
import { UsuarioComponent } from "./usuario.component";
import { UsuarioFormComponent } from "./usuario-form.component";
import { UsuarioService } from "./usuario.service";
import { usuarioRoutes } from "./usuario.routing";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgbModule, NgbCollapseModule, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { UsuarioAlterarSenhaComponent } from "./usuario-alterar-senha.component";
import { AppFileUploadModule } from "../../_core/_components/app-file-upload/app-file-upload.module";

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        FormsModule,
        ReactiveFormsModule,
        NgMultiSelectDropDownModule,
        NgbModule,
        NgbCollapseModule,
        NgbDatepickerModule,
        RouterModule.forChild(usuarioRoutes),
        AppFileUploadModule
    ],
    declarations: [
        UsuarioComponent,
        UsuarioFormComponent,
        UsuarioAlterarSenhaComponent
    ],
    providers: [
        UsuarioService
    ]
})
export class UsuarioModule {
}