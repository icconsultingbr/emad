import { NgModule } from "@angular/core";
import { CoreModule } from "../../../_core/core.module";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AppGridViewModule } from "../../../_core/_components/app-grid-view/app-grid-view.module";
import { AppFormModule } from "../../../_core/_components/app-form/app-form.module";
import { ProdutoExameComponent } from "./produto-exame.component";
import { ProdutoExameFormComponent } from "./produto-exame-form.component";
import { ProdutoExameService } from "./produto-exame.service";
import { produtoExameRoutes } from "./produto-exame.routing";

@NgModule({
    imports: [
        CommonModule,
        CoreModule,
        AppGridViewModule,
        AppFormModule,
        RouterModule.forChild(produtoExameRoutes)
    ],
    declarations: [
        ProdutoExameComponent,
        ProdutoExameFormComponent,
    ],
    providers: [
        ProdutoExameService
    ]
})
export class ProdutoExameModule {
}