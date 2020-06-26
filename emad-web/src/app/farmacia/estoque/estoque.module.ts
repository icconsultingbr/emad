import { NgModule } from "@angular/core";
import { CoreModule } from "../../_core/core.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppGridViewModule } from "../../_core/_components/app-grid-view/app-grid-view.module";
import { AppFormModule } from "../../_core/_components/app-form/app-form.module";
import { EstoqueComponent } from "./estoque.component";
import { EstoqueFormComponent } from "./estoque-form.component";
import { EstoqueService } from "./estoque.service";
import { estoqueRoutes } from "./estoque.routing";

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(estoqueRoutes)
    ],
    declarations: [
        EstoqueComponent,
        EstoqueFormComponent,
    ],
    providers: [
        EstoqueService
    ]
})
export class EstoqueModule {
}