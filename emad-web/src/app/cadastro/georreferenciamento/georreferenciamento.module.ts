import { NgModule } from "@angular/core";
import { CoreModule } from "../../_core/core.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppGridViewModule } from "../../_core/_components/app-grid-view/app-grid-view.module";
import { AppFormModule } from "../../_core/_components/app-form/app-form.module";
import { GeorreferenciamentoComponent } from "./georreferenciamento.component";
import { GeorreferenciamentoService } from "./georreferenciamento.service";
import { georreferenciamentoRoutes } from "./georreferenciamento.routing";
import 'rxjs/add/operator/map';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,        
        FormsModule,
        RouterModule.forChild(georreferenciamentoRoutes)
    ],
    declarations: [
        GeorreferenciamentoComponent,
    ],
    providers: [
        GeorreferenciamentoService
    ]
})
export class GeorreferenciamentoModule {
}